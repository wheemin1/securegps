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
    previewData: [],
    queuedFiles: [],
    queuedMetadata: []
  });
  
  const [options, setOptions] = useState<ProcessingOptions>({
    keepICC: false,
    forceJPEG: false,
    quality: 85
  });
  
  const { toast } = useToast();
  const workerRef = useRef<Worker | null>(null);
  const processingResults = useRef<FileProcessingResult[]>([]);
  const downloadableRef = useRef<{ blob: Blob; filename: string; kind: 'single' | 'zip'; count: number } | null>(null);

  const buildDeletionLog = useCallback((files: File[], previewData?: FileMetadata[]) => {
    if (!previewData || previewData.length === 0) return [];

    return files.map((file, index) => {
      const meta = previewData[index];
      const entries: Array<{ label: string; before: string }> = [];

      if (meta?.hasGps) {
        if (meta.location) {
          entries.push({ label: 'GPS Latitude', before: meta.location.latitude.toFixed(6) });
          entries.push({ label: 'GPS Longitude', before: meta.location.longitude.toFixed(6) });
        } else {
          entries.push({ label: 'GPS Tags', before: 'Present' });
        }
      }

      if (meta?.cameraInfo) {
        entries.push({ label: 'Device / Camera', before: meta.cameraInfo });
      }

      if (meta?.dateTimeOriginal) {
        entries.push({ label: 'Date Taken', before: meta.dateTimeOriginal });
      }

      const otherTypes = (meta?.metadataFound || []).filter(
        (type) => !type.includes('GPS')
      );
      if (otherTypes.length > 0) {
        entries.push({ label: 'Other Metadata', before: otherTypes.join(', ') });
      }

      return {
        fileName: meta?.fileName || file.name,
        entries
      };
    });
  }, []);

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

  const addFilesToQueue = useCallback(async (files: File[]) => {
    const supportedFiles = files.filter(isFormatSupported);
    
    if (supportedFiles.length === 0) {
      toast({
        title: 'No supported files',
        description: 'Please select valid image files (JPG, PNG, or WebP)',
        variant: 'destructive'
      });
      return;
    }

    const newMetadata = await Promise.all(
      supportedFiles.map(file => extractMetadata(file))
    );

    setState(prev => ({
      ...prev,
      status: 'queued',
      queuedFiles: [...(prev.queuedFiles || []), ...supportedFiles],
      queuedMetadata: [...(prev.queuedMetadata || []), ...newMetadata],
      message: `${(prev.queuedFiles?.length || 0) + supportedFiles.length} photos ready to clean`
    }));
  }, [toast]);

  const removeFileFromQueue = useCallback((index: number) => {
    setState(prev => {
      const newQueuedFiles = [...(prev.queuedFiles || [])];
      const newQueuedMetadata = [...(prev.queuedMetadata || [])];
      newQueuedFiles.splice(index, 1);
      newQueuedMetadata.splice(index, 1);
      
      return {
        ...prev,
        status: newQueuedFiles.length === 0 ? 'idle' : 'queued',
        queuedFiles: newQueuedFiles,
        queuedMetadata: newQueuedMetadata,
        message: newQueuedFiles.length === 0 ? '' : `${newQueuedFiles.length} photos ready to clean`
      };
    });
  }, []);

  const startBatchProcessing = useCallback(() => {
    if (!state.queuedFiles || state.queuedFiles.length === 0) return;
    
    setState(prev => ({
      ...prev,
      status: 'preview',
      selectedFiles: prev.queuedFiles,
      previewData: prev.queuedMetadata
    }));
  }, [state.queuedFiles, state.queuedMetadata]);

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

    const minDelayMs = 1500 + Math.floor(Math.random() * 1000);
    const processingStartedAt = Date.now();

    const deletionLog = buildDeletionLog(selectedFiles, state.previewData);

    // Initialize processing state
    setState(prev => ({
      ...prev,
      status: 'processing',
      currentFile: selectedFiles[0].name,
      processed: 0,
      progress: 0,
      message: `Cleaning ${0} / ${selectedFiles.length}...`,
      queuedFiles: [],
      queuedMetadata: []
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
        const elapsed = Date.now() - processingStartedAt;
        if (elapsed < minDelayMs) {
          await new Promise<void>((resolve) => setTimeout(resolve, minDelayMs - elapsed));
        }

        if (successfulResults.length === 1) {
          downloadableRef.current = {
            blob: successfulResults[0].cleanedBlob,
            filename: successfulResults[0].filename,
            kind: 'single',
            count: 1
          };
          setState({
            status: 'result',
            currentFile: null,
            processed: 1,
            total: selectedFiles.length,
            progress: 100,
            message: 'Ready. Review the result and download when you are ready.',
            selectedFiles,
            previewData: state.previewData,
            deletionLog,
            download: {
              kind: 'single',
              filename: successfulResults[0].filename,
              count: 1
            }
          });
        } else {
          const zipBlob = await createZipFile(
            successfulResults.map(r => ({
              blob: r.cleanedBlob,
              filename: r.filename
            }))
          );
          const zipFilename = generateZipFilename();
          downloadableRef.current = {
            blob: zipBlob,
            filename: zipFilename,
            kind: 'zip',
            count: successfulResults.length
          };
          setState({
            status: 'result',
            currentFile: null,
            processed: successfulResults.length,
            total: selectedFiles.length,
            progress: 100,
            message: 'Ready. Review the result and download when you are ready.',
            selectedFiles,
            previewData: state.previewData,
            deletionLog,
            download: {
              kind: 'zip',
              filename: zipFilename,
              count: successfulResults.length
            }
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to prepare the processed files for download.',
          variant: 'destructive'
        });
        setState(prev => ({ ...prev, status: 'error' }));
      }
    } else {
      setState(prev => ({ ...prev, status: 'error', message: 'No files were successfully processed.' }));
    }
  }, [buildDeletionLog, options, state.previewData, toast, initWorker]);

  const downloadResults = useCallback(async () => {
    const downloadable = downloadableRef.current;
    if (!downloadable) {
      toast({
        title: 'Nothing to download',
        description: 'Please process a photo first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await downloadFile(downloadable.blob, downloadable.filename);
      toast({
        title: 'Download started',
        description: downloadable.kind === 'zip'
          ? `Downloading ${downloadable.count} cleaned photos as ZIP.`
          : 'Downloading your cleaned photo.'
      });
      setState(prev => ({
        ...prev,
        message: 'Download started. You can process more photos anytime.'
      }));
    } catch {
      toast({
        title: 'Download failed',
        description: 'Your browser blocked the download. Try again by tapping the button once.',
        variant: 'destructive'
      });
    }
  }, [toast]);

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
    downloadableRef.current = null;
  }, []);

  const updateOptions = useCallback((newOptions: Partial<ProcessingOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    state,
    options,
    previewFiles,
    addFilesToQueue,
    removeFileFromQueue,
    startBatchProcessing,
    confirmProcessing,
    downloadResults,
    reset,
    updateOptions
  };
}
