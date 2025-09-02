export interface ProcessingOptions {
  keepICC: boolean;
  forceJPEG: boolean;
  quality: number;
}

export interface ProcessingState {
  status: 'idle' | 'preview' | 'processing' | 'success' | 'error';
  currentFile: string | null;
  processed: number;
  total: number;
  progress: number;
  message: string;
  selectedFiles?: File[];
  previewData?: FileMetadata[];
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
  pending?: boolean;
}

export interface SupportedFormat {
  extension: string;
  mimeTypes: string[];
  canProcess: boolean;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  dimensions?: { width: number; height: number };
  hasExif: boolean;
  hasGps: boolean;
  cameraInfo?: string;
  location?: { latitude: number; longitude: number };
  dateTimeOriginal?: string;
  metadataFound: string[];
}
