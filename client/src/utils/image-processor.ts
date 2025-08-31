import { ProcessingOptions, SupportedFormat } from '@/types';

export const supportedFormats: SupportedFormat[] = [
  { extension: 'jpg', mimeTypes: ['image/jpeg'], canProcess: true },
  { extension: 'jpeg', mimeTypes: ['image/jpeg'], canProcess: true },
  { extension: 'png', mimeTypes: ['image/png'], canProcess: true },
  { extension: 'webp', mimeTypes: ['image/webp'], canProcess: true },
  { extension: 'heic', mimeTypes: ['image/heic'], canProcess: false },
  { extension: 'avif', mimeTypes: ['image/avif'], canProcess: false },
];

export function isFormatSupported(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return supportedFormats.some(format => 
    format.extension === extension && 
    format.mimeTypes.includes(file.type) &&
    format.canProcess
  );
}

export async function canBrowserDecode(file: File): Promise<boolean> {
  // Check if browser can decode HEIC/AVIF locally
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return false;
  
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function removeMetadata(
  file: File, 
  options: ProcessingOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      try {
        // Set canvas dimensions to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Draw image to canvas (this strips all metadata)
        ctx.drawImage(img, 0, 0);
        
        // Determine output format
        let outputType = file.type;
        if (options.forceJPEG || file.type === 'image/jpeg') {
          outputType = 'image/jpeg';
        } else if (file.type === 'image/png') {
          outputType = 'image/png';
        } else if (file.type === 'image/webp') {
          outputType = 'image/webp';
        }
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          outputType,
          outputType === 'image/jpeg' || outputType === 'image/webp' 
            ? options.quality / 100 
            : undefined
        );
        
        // Clean up
        URL.revokeObjectURL(img.src);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export function generateCleanFilename(originalName: string, forceJPEG: boolean): string {
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  
  if (forceJPEG && ['png', 'webp'].includes(extension)) {
    return `${nameWithoutExt}_clean.jpg`;
  }
  
  return `${nameWithoutExt}_clean.${extension}`;
}

export function generateZipFilename(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 5).replace(':', '');
  return `privateshare_clean_${date}_${time}.zip`;
}

export async function downloadFile(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
