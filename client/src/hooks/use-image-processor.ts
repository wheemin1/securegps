import { useState, useCallback, useRef } from 'react';
import { ProcessingOptions, ProcessingState, FileProcessingResult } from '@/types';
import { isFormatSupported, generateZipFilename, downloadFile } from '@/utils/image-processor';
import { createZipFile } from '@/utils/zip-handler';
import { useToast } from '@/hooks/use-toast';

export function useImageProcessor() {
  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
    currentFile: null,
    processed: 0,
    total: 0,
    progress: 0,
    message: ''
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
        
        if (type === 'PROCESSING_COMPLETE' && blob && filename) {
          const result: FileProcessingResult = {
            originalFile: processingResults.current.find(r => r.originalFile.name === id)?.originalFile!,
            cleanedBlob: blob,
            filename,
            success: true
          };
          
          processingResults.current = processingResults.current.map(r => 
            r.originalFile.name === id ? result : r
          );
          
          setState(prev => ({
            ...prev,
            processed: prev.processed + 1,
            progress: ((prev.processed + 1) / prev.total) * 100
          }));
          
        } else if (type === 'PROCESSING_ERROR') {
          const result: FileProcessingResult = {
            originalFile: processingResults.current.find(r => r.originalFile.name === id)?.originalFile!,
            cleanedBlob: new Blob(),
            filename: '',
            success: false,
            error
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

  const processFiles = useCallback(async (files: File[]) => {
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

    if (supportedFiles.length === 0) {
      return;
    }

    // Initialize processing state
    setState({
      status: 'processing',
      currentFile: supportedFiles[0].name,
      processed: 0,
      total: supportedFiles.length,
      progress: 0,
      message: `Cleaning ${0} / ${supportedFiles.length}...`
    });

    // Initialize results array
    processingResults.current = supportedFiles.map(file => ({
      originalFile: file,
      cleanedBlob: new Blob(),
      filename: '',
      success: false
    }));

    // Initialize worker
    initWorker();

    // Process files in batches of 5 to avoid overwhelming the browser
    const batchSize = 5;
    for (let i = 0; i < supportedFiles.length; i += batchSize) {
      const batch = supportedFiles.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(file => {
          return new Promise<void>((resolve) => {
            const checkCompletion = () => {
              const result = processingResults.current.find(r => r.originalFile.name === file.name);
              if (result && (result.success !== undefined)) {
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
    const successfulResults = processingResults.current.filter(r => r.success);
    const failedResults = processingResults.current.filter(r => !r.success);

    if (failedResults.length > 0) {
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
        if (successfulResults.length === 1) {
          // Single file - direct download
          await downloadFile(successfulResults[0].cleanedBlob, successfulResults[0].filename);
          setState({
            status: 'success',
            currentFile: null,
            processed: successfulResults.length,
            total: supportedFiles.length,
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
            total: supportedFiles.length,
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
      message: ''
    });
    processingResults.current = [];
  }, []);

  const updateOptions = useCallback((newOptions: Partial<ProcessingOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    state,
    options,
    processFiles,
    reset,
    updateOptions
  };
}
