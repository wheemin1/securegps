export interface ProcessingOptions {
  keepICC: boolean;
  forceJPEG: boolean;
  quality: number;
}

export type ProcessingOperation = 'remove' | 'edit';

export interface GpsCoordinate {
  latitude: number;
  longitude: number;
}

export type GpsEditByIndex = Record<number, GpsCoordinate>;

export interface ProcessingPayload {
  operation: ProcessingOperation;
  gpsEdits?: GpsEditByIndex;
  metadataEdits?: Record<number, { dateTime?: string; device?: string }>;
}

export type TableRowStatus = 'analyzing' | 'ready' | 'processing' | 'done' | 'failed';

export interface TableRowEdit {
  latitude: string;
  longitude: string;
  dateTime: string;
  device: string;
  status: TableRowStatus;
}

export interface ProcessingState {
  status: 'idle' | 'queued' | 'preview' | 'processing' | 'result' | 'error';
  currentFile: string | null;
  processed: number;
  total: number;
  progress: number;
  message: string;
  selectedFiles?: File[];
  previewData?: FileMetadata[];
  queuedFiles?: File[];
  queuedMetadata?: FileMetadata[];
  download?: {
    kind: 'single' | 'zip';
    filename: string;
    count: number;
  };
  deletionLog?: Array<{
    fileName: string;
    entries: Array<{ label: string; before: string }>;
  }>;
  operation?: ProcessingOperation;
  editSummary?: {
    locationAdded: number;
    locationUpdated: number;
    locationRemoved: number;
    dateUpdated: number;
    deviceUpdated: number;
  };
  tableEdits?: Record<number, TableRowEdit>;
  selectedRowIndices?: number[];
  bulkDraftLocation?: {
    latitude: string;
    longitude: string;
  };
  bulkTimeDraft?: {
    mode: 'offset' | 'absolute';
    offsetMinutes: number;
    absoluteDateTime: string;
  };
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
  __uniqueId?: string; // Add unique ID field
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
