export interface ProcessingOptions {
  keepICC: boolean;
  forceJPEG: boolean;
  quality: number;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  currentFile: string | null;
  processed: number;
  total: number;
  progress: number;
  message: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface FileProcessingResult {
  originalFile: File;
  cleanedBlob: Blob;
  filename: string;
  success: boolean;
  error?: string;
}

export interface SupportedFormat {
  extension: string;
  mimeTypes: string[];
  canProcess: boolean;
}
