// Web Worker for processing images in background
import { ProcessingOptions } from '@/types';

interface WorkerMessage {
  type: 'PROCESS_IMAGE';
  file: File;
  options: ProcessingOptions;
  id: string;
}

interface WorkerResponse {
  type: 'PROCESSING_COMPLETE' | 'PROCESSING_ERROR';
  id: string;
  blob?: Blob;
  filename?: string;
  error?: string;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, file, options, id } = event.data;
  
  if (type === 'PROCESS_IMAGE') {
    try {
      // Process image using OffscreenCanvas if available
      const canvas = new OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('OffscreenCanvas not supported');
      }
      
      // Create image bitmap from file
      const imageBitmap = await createImageBitmap(file);
      
      // Set canvas size
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      
      // Draw image (strips metadata)
      ctx.drawImage(imageBitmap, 0, 0);
      
      // Determine output format
      let outputType = file.type;
      if (options.forceJPEG || file.type === 'image/jpeg') {
        outputType = 'image/jpeg';
      }
      
      // Convert to blob
      const blob = await canvas.convertToBlob({
        type: outputType,
        quality: outputType === 'image/jpeg' || outputType === 'image/webp' 
          ? options.quality / 100 
          : undefined
      });
      
      // Generate clean filename
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      let filename: string;
      if (options.forceJPEG && ['png', 'webp'].includes(extension)) {
        filename = `${nameWithoutExt}_clean.jpg`;
      } else {
        filename = `${nameWithoutExt}_clean.${extension}`;
      }
      
      // Send result back
      const response: WorkerResponse = {
        type: 'PROCESSING_COMPLETE',
        id,
        blob,
        filename
      };
      
      self.postMessage(response);
      
    } catch (error) {
      const response: WorkerResponse = {
        type: 'PROCESSING_ERROR',
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      self.postMessage(response);
    }
  }
};
