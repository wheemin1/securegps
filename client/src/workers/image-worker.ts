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
  
  console.log('Worker received message:', { type, fileName: file.name, options, id });
  
  if (type === 'PROCESS_IMAGE') {
    try {
      // Check if OffscreenCanvas is available
      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error('OffscreenCanvas is not supported in this browser');
      }
      
      // Process image using OffscreenCanvas if available
      const canvas = new OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get 2D context from OffscreenCanvas');
      }
      
      console.log('Creating image bitmap from file:', file.name);
      
      // Create image bitmap from file
      const imageBitmap = await createImageBitmap(file);
      
      console.log('Image bitmap created:', { width: imageBitmap.width, height: imageBitmap.height });
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      
      console.log('Canvas resized to:', { width: canvas.width, height: canvas.height });
      
      // Draw image (strips metadata)
      ctx.drawImage(imageBitmap, 0, 0);
      
      console.log('Image drawn to canvas');
      
      // Determine output format
      let outputType = file.type;
      if (options.forceJPEG || file.type === 'image/jpeg') {
        outputType = 'image/jpeg';
      }
      
      console.log('Output type determined:', outputType);
      
      // Convert to blob
      const blob = await canvas.convertToBlob({
        type: outputType,
        quality: outputType === 'image/jpeg' || outputType === 'image/webp' 
          ? options.quality / 100 
          : undefined
      });
      
      console.log('Blob created:', { size: blob.size, type: blob.type });
      
      // Generate clean filename
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      let filename: string;
      if (options.forceJPEG && ['png', 'webp'].includes(extension)) {
        filename = `${nameWithoutExt}_clean.jpg`;
      } else {
        filename = `${nameWithoutExt}_clean.${extension}`;
      }
      
      console.log('Generated filename:', filename);
      
      // Send result back
      const response: WorkerResponse = {
        type: 'PROCESSING_COMPLETE',
        id,
        blob,
        filename
      };
      
      console.log('Sending response back to main thread:', { type: response.type, id: response.id, filename: response.filename });
      console.log('✅ Will clean: EXIF | XMP | IPTC (metadata stripped via canvas reencoding)');
      
      self.postMessage(response);
      
    } catch (error) {
      console.error('Worker processing error:', error);
      const response: WorkerResponse = {
        type: 'PROCESSING_ERROR',
        id,
        error: error instanceof Error ? error.message : String(error)
      };
      
      self.postMessage(response);
    }
  }
};
