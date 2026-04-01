// Web Worker for processing images in background
import piexif from 'piexifjs';
import { GpsCoordinate, ProcessingOperation, ProcessingOptions } from '@/types';

interface WorkerMessage {
  type: 'PROCESS_IMAGE';
  file: File;
  options: ProcessingOptions;
  id: string;
  operation?: ProcessingOperation;
  gpsLocation?: GpsCoordinate;
  metadataEdit?: {
    dateTime?: string;
    device?: string;
  };
}

interface WorkerResponse {
  type: 'PROCESSING_COMPLETE' | 'PROCESSING_ERROR';
  id: string;
  blob?: Blob;
  filename?: string;
  error?: string;
}

const toRational = (value: number, scale = 1000000): [number, number] => {
  const numerator = Math.round(value * scale);
  return [numerator, scale];
};

const toGpsDms = (decimal: number): [[number, number], [number, number], [number, number]] => {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  return [
    [degrees, 1],
    [minutes, 1],
    toRational(seconds),
  ];
};

const blobToDataUrl = async (blob: Blob): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image blob as data URL'));
    reader.readAsDataURL(blob);
  });
};

const applyMetadataToJpeg = async (
  jpegBlob: Blob,
  gps: GpsCoordinate | undefined,
  metadataEdit: { dateTime?: string; device?: string } | undefined
): Promise<Blob> => {
  const dataUrl = await blobToDataUrl(jpegBlob);
  const dateTime = metadataEdit?.dateTime?.trim() || '';
  const device = metadataEdit?.device?.trim() || '';
  const exifObj = {
    '0th': {},
    Exif: {},
    GPS: gps
      ? {
          [piexif.GPSIFD.GPSLatitudeRef]: gps.latitude >= 0 ? 'N' : 'S',
          [piexif.GPSIFD.GPSLatitude]: toGpsDms(gps.latitude),
          [piexif.GPSIFD.GPSLongitudeRef]: gps.longitude >= 0 ? 'E' : 'W',
          [piexif.GPSIFD.GPSLongitude]: toGpsDms(gps.longitude),
        }
      : {},
    Interop: {},
    '1st': {},
    thumbnail: undefined,
  } as any;

  if (dateTime) {
    exifObj['0th'][piexif.ImageIFD.DateTime] = dateTime;
    exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = dateTime;
    exifObj.Exif[piexif.ExifIFD.DateTimeDigitized] = dateTime;
  }
  if (device) {
    exifObj['0th'][piexif.ImageIFD.Model] = device;
    exifObj['0th'][piexif.ImageIFD.Make] = 'SecureGPS';
  }

  const exifBytes = piexif.dump(exifObj);
  const inserted = piexif.insert(exifBytes, dataUrl);
  const response = await fetch(inserted);
  return await response.blob();
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, file, options, id, operation = 'remove', gpsLocation, metadataEdit } = event.data;
  
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
      
      // Create image bitmap from file
      const imageBitmap = await createImageBitmap(file);
      
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      
      // Draw image (strips metadata)
      ctx.drawImage(imageBitmap, 0, 0);
      
      // Determine output format
      const outputType = operation === 'edit'
        ? 'image/jpeg'
        : (options.forceJPEG || file.type === 'image/jpeg')
          ? 'image/jpeg'
          : file.type;

      let blob = await canvas.convertToBlob({
        type: outputType,
        quality: outputType === 'image/jpeg' || outputType === 'image/webp'
          ? options.quality / 100
          : undefined
      });

      if (operation === 'edit') {
        blob = await applyMetadataToJpeg(blob, gpsLocation, metadataEdit);
      }

      imageBitmap.close();
      
      // Generate clean filename
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      let filename: string;
      if (operation === 'edit') {
        filename = `${nameWithoutExt}_geotag.jpg`;
      } else if (options.forceJPEG && ['png', 'webp'].includes(extension)) {
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
        error: error instanceof Error ? error.message : String(error)
      };
      
      self.postMessage(response);
    }
  }
};
