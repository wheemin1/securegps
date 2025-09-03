import { useState, useCallback, useRef } from 'react';
import { ProcessingOptions, ProcessingState, FileProcessingResult } from '@/types';
import { isFormatSupported, generateZipFilename, downloadFile } from '@/utils/image-processor';
import { createZipFile } from '@/utils/zip-handler';
import { extractMetadata } from '@/utils/metadata-extractor';
import { useToast } from '@/hooks/use-toast';

export function useImageProcessor() {
  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
    currentFile: null,
    processed: 0,
    total: 0,
    progress: 0,
    message: '',
    selectedFiles: [],
    previewData: []
  });
  
  const [options, setOptions] = useState<ProcessingOptions>({
    keepICC: false,
    forceJPEG: false,
    quality: 85
  });
  
  const { toast } = useToast();
  const workerRef = useRef<Worker | null>(null);
  const processingResults = useRef<FileProcessingResult[]>([]);

  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/image-worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      workerRef.current.onmessage = (event) => {
        const { type, id, blob, filename, error } = event.data;
        
        console.log('Main thread received worker message:', { type, id, filename, error, blobSize: blob?.size });
        
        if (type === 'PROCESSING_COMPLETE' && blob && filename) {
          console.log('Processing completed successfully for:', id);
          
          // 처리된 파일의 메타데이터를 재검사
          const verifyCleanedFile = async () => {
            try {
              const cleanedFile = new File([blob], filename, { type: blob.type || 'image/jpeg' });
              const cleanedMetadata = await extractMetadata(cleanedFile);
              console.log('🔍 Cleaned file metadata verification:', {
                filename,
                hasGps: cleanedMetadata.hasGps,
                hasExif: cleanedMetadata.hasExif,
                metadataTypes: cleanedMetadata.metadataFound
              });
              
              if (cleanedMetadata.hasGps || cleanedMetadata.metadataFound.length > 0) {
                console.warn('⚠️ Warning: Processed file still contains metadata!', cleanedMetadata);
              } else {
                console.log('✅ Confirmed: Processed file is clean of metadata');
              }
            } catch (error) {
              console.error('Error verifying cleaned file:', error);
            }
          };
          
          verifyCleanedFile();
          
          const result: FileProcessingResult = {
            originalFile: processingResults.current.find(r => r.originalFile.name === id)?.originalFile!,
            cleanedBlob: blob,
            filename,
            success: true,
            pending: false
          };
          
          processingResults.current = processingResults.current.map(r => 
            r.originalFile.name === id ? result : r
          );
          
          console.log('Updated processing results:', processingResults.current);
          
          setState(prev => ({
            ...prev,
            processed: prev.processed + 1,
            progress: ((prev.processed + 1) / prev.total) * 100
          }));
          
        } else if (type === 'PROCESSING_ERROR') {
          console.log('Processing error for:', id, error);
          const result: FileProcessingResult = {
            originalFile: processingResults.current.find(r => r.originalFile.name === id)?.originalFile!,
            cleanedBlob: new Blob(),
            filename: '',
            success: false,
            error,
            pending: false
          };
          
          processingResults.current = processingResults.current.map(r => 
            r.originalFile.name === id ? result : r
          );
          
          setState(prev => ({
            ...prev,
            processed: prev.processed + 1,
            progress: ((prev.processed + 1) / prev.total) * 100
          }));
        }
      };
    }
  }, []);

  const previewFiles = useCallback(async (files: File[]) => {
    console.log('previewFiles called with:', files);
    
    // Filter supported files
    const supportedFiles = files.filter(file => {
      if (!isFormatSupported(file)) {
        toast({
          title: "Unsupported Format",
          description: `${file.name} is not a supported format.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    console.log('supportedFiles:', supportedFiles);

    if (supportedFiles.length === 0) {
      return;
    }

    // Extract metadata from all files
    const previewData = await Promise.all(
      supportedFiles.map(async (file) => {
        const metadata = await extractMetadata(file);
        console.log('🔍 Metadata extracted for', file.name, metadata);
        return metadata;
      })
    );

    console.log('previewData extracted:', previewData);

    // Set preview state
    setState({
      status: 'preview',
      currentFile: null,
      processed: 0,
      total: supportedFiles.length,
      progress: 0,
      message: `Ready to clean ${supportedFiles.length} ${supportedFiles.length === 1 ? 'file' : 'files'}`,
      selectedFiles: supportedFiles,
      previewData
    });
    
    console.log('setState called with selectedFiles:', supportedFiles);
  }, [toast]);

  const confirmProcessing = useCallback(async (filesToProcess?: File[]) => {
    console.log('confirmProcessing called with files:', filesToProcess);
    console.log('current state:', state);
    
    // Use passed files or state files
    const selectedFiles = filesToProcess || state.selectedFiles;
    
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('No files selected, returning');
      return;
    }

    console.log('Processing files:', selectedFiles);

    // Initialize processing state
    setState(prev => ({
      ...prev,
      status: 'processing',
      currentFile: selectedFiles[0].name,
      processed: 0,
      progress: 0,
      message: `Cleaning ${0} / ${selectedFiles.length}...`
    }));

    // Initialize results array
    processingResults.current = selectedFiles.map(file => ({
      originalFile: file,
      cleanedBlob: new Blob(),
      filename: '',
      success: false,
      pending: true // Add pending flag
    }));

    // Initialize worker
    initWorker();

    // Process files in batches of 5 to avoid overwhelming the browser
    const batchSize = 5;
    for (let i = 0; i < selectedFiles.length; i += batchSize) {
      const batch = selectedFiles.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map((file: File) => {
          return new Promise<void>((resolve) => {
            const checkCompletion = () => {
              const result = processingResults.current.find(r => r.originalFile.name === file.name);
              if (result && !result.pending) {
                setState(prev => ({
                  ...prev,
                  currentFile: file.name,
                  message: `Cleaning ${prev.processed} / ${prev.total}...`
                }));
                resolve();
              } else {
                setTimeout(checkCompletion, 100);
              }
            };
            
            // Send to worker
            workerRef.current?.postMessage({
              type: 'PROCESS_IMAGE',
              file,
              options,
              id: file.name
            });
            
            checkCompletion();
          });
        })
      );
    }

    // All files processed, handle download
    console.log('🎯 Processing complete, starting download phase...');
    const successfulResults = processingResults.current.filter(r => r.success);
    const failedResults = processingResults.current.filter(r => !r.success);
    
    console.log(`📊 Results summary: ${successfulResults.length} successful, ${failedResults.length} failed`);

    if (failedResults.length > 0) {
      console.log('❌ Failed results:', failedResults);
      failedResults.forEach(result => {
        toast({
          title: "Processing Error",
          description: `Failed to process ${result.originalFile.name}: ${result.error}`,
          variant: "destructive",
        });
      });
    }

    if (successfulResults.length > 0) {
      try {
        console.log('🚀 Initiating download for successful results...');
        if (successfulResults.length === 1) {
          // Single file - direct download
          console.log('📁 Single file download mode');
          await downloadFile(successfulResults[0].cleanedBlob, successfulResults[0].filename);
          setState({
            status: 'success',
            currentFile: null,
            processed: successfulResults.length,
            total: selectedFiles.length,
            progress: 100,
            message: `Downloaded cleaned image: ${successfulResults[0].filename}`
          });
        } else {
          // Multiple files - create ZIP
          const zipBlob = await createZipFile(
            successfulResults.map(r => ({
              blob: r.cleanedBlob,
              filename: r.filename
            }))
          );
          
          const zipFilename = generateZipFilename();
          await downloadFile(zipBlob, zipFilename);
          
          setState({
            status: 'success',
            currentFile: null,
            processed: successfulResults.length,
            total: selectedFiles.length,
            progress: 100,
            message: `Downloaded ${successfulResults.length} cleaned images in ${zipFilename}`
          });
        }
      } catch (error) {
        toast({
          title: "Download Error",
          description: "Failed to download processed files.",
          variant: "destructive",
        });
        setState(prev => ({ ...prev, status: 'error' }));
      }
    } else {
      setState(prev => ({ ...prev, status: 'error', message: 'No files were successfully processed.' }));
    }
  }, [options, toast, initWorker]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      currentFile: null,
      processed: 0,
      total: 0,
      progress: 0,
      message: '',
      selectedFiles: [],
      previewData: []
    });
    processingResults.current = [];
  }, []);

  const updateOptions = useCallback((newOptions: Partial<ProcessingOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    state,
    options,
    previewFiles,
    confirmProcessing,
    reset,
    updateOptions
  };
}
