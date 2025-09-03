import { FileMetadata } from '@/types';

export async function extractMetadata(file: File): Promise<FileMetadata> {
  console.log('🔍 Raw scan started on original file:', { name: file.name, size: file.size, type: file.type });
  
  const metadata: FileMetadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasExif: false,
    hasGps: false,
    metadataFound: []
  };

  try {
    // Get image dimensions
    const dimensions = await getImageDimensions(file);
    if (dimensions) {
      metadata.dimensions = dimensions;
    }

    // Check for EXIF data by reading file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log('📄 File buffer loaded, scanning for metadata blocks...');
    
    // Check if JPEG file has EXIF data
    if (file.type === 'image/jpeg') {
      const exifResult = parseJpegExif(uint8Array);
      console.log('🏷️ EXIF scan result:', {
        hasExif: exifResult.hasExif,
        hasGps: exifResult.hasGps,
        cameraInfo: exifResult.cameraInfo,
        location: exifResult.location
      });
      
      if (exifResult.hasExif) {
        metadata.hasExif = true;
        metadata.metadataFound.push('EXIF');
        
        if (exifResult.cameraInfo) {
          metadata.cameraInfo = exifResult.cameraInfo;
        }
        if (exifResult.dateTimeOriginal) {
          metadata.dateTimeOriginal = exifResult.dateTimeOriginal;
        }
      }
      
      if (exifResult.hasGps) {
        metadata.hasGps = true;
        metadata.metadataFound.push('GPS (found in EXIF)');
        if (exifResult.location) {
          metadata.location = exifResult.location;
          console.log('🗺️ GPS coordinates found:', metadata.location);
        }
      } else {
        console.log('❌ No GPS data found in EXIF');
      }
      
      // Also check for XMP and IPTC
      const xmpResult = parseJpegXmp(uint8Array);
      if (xmpResult.hasXmp) {
        metadata.metadataFound.push('XMP');
        console.log('📋 XMP metadata found');
        if (xmpResult.hasGps) {
          metadata.hasGps = true;
          metadata.metadataFound.push('GPS (found in XMP)');
          console.log('🗺️ GPS data also found in XMP');
        } else {
          console.log('❌ No GPS data found in XMP');
        }
      } else {
        console.log('❌ No XMP metadata found');
      }
      
      const iptcResult = parseJpegIptc(uint8Array);
      if (iptcResult.hasIptc) {
        metadata.metadataFound.push('IPTC');
        console.log('📋 IPTC metadata found');
      } else {
        console.log('❌ No IPTC metadata found');
      }
    } else if (file.type === 'image/png') {
      const pngResult = parsePngMetadata(uint8Array);
      if (pngResult.hasTextChunks) {
        metadata.metadataFound.push('PNG text chunks');
      }
    } else if (file.type === 'image/webp') {
      const webpResult = parseWebpMetadata(uint8Array);
      if (webpResult.hasExif) {
        metadata.hasExif = true;
        metadata.metadataFound.push('EXIF');
      }
      if (webpResult.hasMetadata) {
        metadata.metadataFound.push('WebP metadata');
      }
    }
    
  } catch (error) {
    console.error('🚨 Error during metadata extraction:', error);
  }

  // Final metadata summary
  console.log('📊 Final metadata scan result:', {
    fileName: metadata.fileName,
    hasExif: metadata.hasExif,
    hasGps: metadata.hasGps,
    metadataTypes: metadata.metadataFound,
    location: metadata.location || 'No GPS coordinates'
  });

  return metadata;
}

interface ExifParseResult {
  hasExif: boolean;
  hasGps: boolean;
  cameraInfo?: string;
  dateTimeOriginal?: string;
  location?: { latitude: number; longitude: number };
}

function parseJpegExif(data: Uint8Array): ExifParseResult {
  const result: ExifParseResult = {
    hasExif: false,
    hasGps: false
  };

  // Find APP1 EXIF marker
  let exifStart = -1;
  for (let i = 0; i < data.length - 10; i++) {
    if (data[i] === 0xFF && data[i + 1] === 0xE1) {
      // Check for "Exif\0\0"
      if (data[i + 4] === 0x45 && data[i + 5] === 0x78 && 
          data[i + 6] === 0x69 && data[i + 7] === 0x66 &&
          data[i + 8] === 0x00 && data[i + 9] === 0x00) {
        exifStart = i + 10; // Start after "Exif\0\0"
        break;
      }
    }
  }

  if (exifStart === -1) return result;

  result.hasExif = true;

  try {
    const tiffStart = exifStart;
    
    // Check byte order
    const byteOrder = (data[tiffStart] === 0x49 && data[tiffStart + 1] === 0x49) ? 'little' : 'big';
    
    // Get IFD0 offset
    const ifd0Offset = readUint32(data, tiffStart + 4, byteOrder);
    const ifd0 = parseIFD(data, tiffStart + ifd0Offset, tiffStart, byteOrder);
    
    // Extract camera info
    if (ifd0.make && ifd0.model) {
      result.cameraInfo = `${ifd0.make.trim()} ${ifd0.model.trim()}`;
    }
    
    if (ifd0.dateTime) {
      result.dateTimeOriginal = ifd0.dateTime;
    }
    
    // Check for GPS IFD
    if (ifd0.gpsIfdOffset) {
      console.log('🗺️ GPS IFD found, checking for actual GPS data...');
      const gpsIfd = parseGpsIFD(data, tiffStart + ifd0.gpsIfdOffset, tiffStart, byteOrder);
      if (gpsIfd.hasGps && gpsIfd.location) {
        result.hasGps = true;
        result.location = gpsIfd.location;
        console.log('✅ Valid GPS data confirmed:', gpsIfd.location);
      } else {
        console.log('❌ GPS IFD exists but no valid GPS coordinates found');
      }
    } else {
      console.log('❌ No GPS IFD found in EXIF');
    }

    // Check ExifSubIFD for more data
    if (ifd0.exifIfdOffset) {
      const exifSubIfd = parseIFD(data, tiffStart + ifd0.exifIfdOffset, tiffStart, byteOrder);
      if (exifSubIfd.dateTimeOriginal) {
        result.dateTimeOriginal = exifSubIfd.dateTimeOriginal;
      }
    }
    
  } catch (error) {
    console.error('Error parsing EXIF:', error);
  }

  return result;
}

function parseIFD(data: Uint8Array, ifdStart: number, tiffStart: number, byteOrder: 'little' | 'big'): any {
  const ifd: any = {};
  const entryCount = readUint16(data, ifdStart, byteOrder);
  
  for (let i = 0; i < entryCount; i++) {
    const entryStart = ifdStart + 2 + (i * 12);
    const tag = readUint16(data, entryStart, byteOrder);
    const type = readUint16(data, entryStart + 2, byteOrder);
    const count = readUint32(data, entryStart + 4, byteOrder);
    const valueOffset = readUint32(data, entryStart + 8, byteOrder);
    
    switch (tag) {
      case 0x010F: // Make
        ifd.make = readString(data, tiffStart + valueOffset, count);
        break;
      case 0x0110: // Model
        ifd.model = readString(data, tiffStart + valueOffset, count);
        break;
      case 0x0132: // DateTime
        ifd.dateTime = readString(data, tiffStart + valueOffset, count);
        break;
      case 0x8769: // ExifSubIFD
        ifd.exifIfdOffset = valueOffset;
        break;
      case 0x8825: // GPSInfo
        ifd.gpsIfdOffset = valueOffset;
        break;
      case 0x9003: // DateTimeOriginal (in ExifSubIFD)
        ifd.dateTimeOriginal = readString(data, tiffStart + valueOffset, count);
        break;
    }
  }
  
  return ifd;
}

function parseGpsIFD(data: Uint8Array, gpsStart: number, tiffStart: number, byteOrder: 'little' | 'big'): any {
  const gps: any = { hasGps: false };
  const entryCount = readUint16(data, gpsStart, byteOrder);
  
  let latRef = '';
  let lonRef = '';
  let latDegrees: number[] = [];
  let lonDegrees: number[] = [];
  
  for (let i = 0; i < entryCount; i++) {
    const entryStart = gpsStart + 2 + (i * 12);
    const tag = readUint16(data, entryStart, byteOrder);
    const type = readUint16(data, entryStart + 2, byteOrder);
    const count = readUint32(data, entryStart + 4, byteOrder);
    const valueOffset = readUint32(data, entryStart + 8, byteOrder);
    
    switch (tag) {
      case 0x0001: // GPSLatitudeRef
        latRef = String.fromCharCode(data[tiffStart + valueOffset]);
        break;
      case 0x0002: // GPSLatitude
        latDegrees = readRationalArray(data, tiffStart + valueOffset, count, byteOrder);
        break;
      case 0x0003: // GPSLongitudeRef
        lonRef = String.fromCharCode(data[tiffStart + valueOffset]);
        break;
      case 0x0004: // GPSLongitude
        lonDegrees = readRationalArray(data, tiffStart + valueOffset, count, byteOrder);
        break;
    }
  }
  
  // Convert GPS coordinates if we have them and they are valid
  if (latDegrees.length >= 2 && lonDegrees.length >= 2 && latRef && lonRef) {
    const latitude = latDegrees[0] + latDegrees[1] / 60 + (latDegrees[2] || 0) / 3600;
    const longitude = lonDegrees[0] + lonDegrees[1] / 60 + (lonDegrees[2] || 0) / 3600;
    
    // Only mark as having GPS if coordinates are actually valid (non-zero and reasonable)
    if (latitude !== 0 && longitude !== 0 && 
        Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 &&
        Math.abs(latitude) > 0.0001 && Math.abs(longitude) > 0.0001) {
      gps.hasGps = true;
      gps.location = {
        latitude: latRef === 'S' ? -latitude : latitude,
        longitude: lonRef === 'W' ? -longitude : longitude
      };
      
      console.log('✅ Valid GPS coordinates found:', {
        latRef, lonRef,
        latDegrees, lonDegrees,
        finalCoords: gps.location
      });
    } else {
      console.log('⚠️ GPS data present but coordinates are zero/invalid:', {
        latitude, longitude, latRef, lonRef
      });
    }
  } else {
    console.log('❌ No valid GPS coordinate data found (missing lat/lon or refs)');
  }
  
  return gps;
}

function readUint16(data: Uint8Array, offset: number, byteOrder: 'little' | 'big'): number {
  if (byteOrder === 'little') {
    return data[offset] + (data[offset + 1] << 8);
  } else {
    return (data[offset] << 8) + data[offset + 1];
  }
}

function readUint32(data: Uint8Array, offset: number, byteOrder: 'little' | 'big'): number {
  if (byteOrder === 'little') {
    return data[offset] + (data[offset + 1] << 8) + (data[offset + 2] << 16) + (data[offset + 3] << 24);
  } else {
    return (data[offset] << 24) + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  }
}

function readString(data: Uint8Array, offset: number, length: number): string {
  let result = '';
  for (let i = 0; i < length - 1; i++) { // -1 to exclude null terminator
    if (data[offset + i] === 0) break;
    result += String.fromCharCode(data[offset + i]);
  }
  return result;
}

function readRationalArray(data: Uint8Array, offset: number, count: number, byteOrder: 'little' | 'big'): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    const numerator = readUint32(data, offset + i * 8, byteOrder);
    const denominator = readUint32(data, offset + i * 8 + 4, byteOrder);
    result.push(denominator === 0 ? 0 : numerator / denominator);
  }
  return result;
}

function parseJpegXmp(data: Uint8Array): { hasXmp: boolean; hasGps: boolean } {
  const result = { hasXmp: false, hasGps: false };
  
  // Look for APP1 XMP marker
  for (let i = 0; i < data.length - 28; i++) {
    if (data[i] === 0xFF && data[i + 1] === 0xE1) {
      // Check for XMP namespace
      const slice = data.slice(i + 4, i + 32);
      const xmpHeader = Array.from(slice).map(b => String.fromCharCode(b)).join('');
      if (xmpHeader.includes('http://ns.adobe.com/xap/1.0/')) {
        result.hasXmp = true;
        
        // More precise GPS check in XMP data
        const xmpSlice = data.slice(i + 32, Math.min(i + 4096, data.length));
        const xmpData = Array.from(xmpSlice).map(b => String.fromCharCode(b)).join('');
        
        // Look for actual GPS coordinate patterns with valid values
        const gpsPatterns = [
          /GPSLatitude[^>]*>([0-9]+(?:\.[0-9]+)?(?:[,/][0-9]+(?:\.[0-9]+)?)*)</i,
          /GPSLongitude[^>]*>([0-9]+(?:\.[0-9]+)?(?:[,/][0-9]+(?:\.[0-9]+)?)*)</i,
          /exif:GPSLatitude[^>]*>([0-9]+(?:\.[0-9]+)?(?:[,/][0-9]+(?:\.[0-9]+)?)*)</i,
          /exif:GPSLongitude[^>]*>([0-9]+(?:\.[0-9]+)?(?:[,/][0-9]+(?:\.[0-9]+)?)*)</i
        ];
        
        let foundValidGps = false;
        let latValue = null;
        let lonValue = null;
        
        for (const pattern of gpsPatterns) {
          const match = xmpData.match(pattern);
          if (match && match[1]) {
            const value = match[1].trim();
            if (value && value !== '0' && !value.includes('0,0,0') && !value.includes('0/1,0/1,0/1')) {
              const numericValue = parseFloat(value.replace(/[,/].*/, ''));
              if (numericValue && Math.abs(numericValue) > 0.0001) {
                if (pattern.toString().toLowerCase().includes('latitude')) {
                  latValue = numericValue;
                } else {
                  lonValue = numericValue;
                }
                if (latValue && lonValue) {
                  foundValidGps = true;
                  break;
                }
              }
            }
          }
        }
        
        if (foundValidGps) {
          result.hasGps = true;
          console.log('✅ Valid GPS data found in XMP');
        } else {
          console.log('❌ No valid GPS coordinates found in XMP');
        }
        break;
      }
    }
  }
  
  return result;
}

function parseJpegIptc(data: Uint8Array): { hasIptc: boolean } {
  const result = { hasIptc: false };
  
  // Look for APP13 IPTC marker (Photoshop Image Resource Blocks)
  for (let i = 0; i < data.length - 14; i++) {
    if (data[i] === 0xFF && data[i + 1] === 0xED) {
      // Check for "Photoshop 3.0" identifier
      const slice = data.slice(i + 4, i + 18);
      const iptcHeader = Array.from(slice).map(b => String.fromCharCode(b)).join('');
      if (iptcHeader.includes('Photoshop 3.0')) {
        result.hasIptc = true;
        break;
      }
    }
  }
  
  return result;
}

function parsePngMetadata(data: Uint8Array): { hasTextChunks: boolean } {
  const result = { hasTextChunks: false };
  
  // PNG signature check
  if (data.length < 8 || data[0] !== 0x89 || data[1] !== 0x50 || data[2] !== 0x4E || data[3] !== 0x47) {
    return result;
  }
  
  let offset = 8; // Skip PNG signature
  
  while (offset < data.length - 12) {
    const chunkLength = readUint32(data, offset, 'big');
    const chunkType = String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7]);
    
    if (['tEXt', 'zTXt', 'iTXt'].includes(chunkType)) {
      result.hasTextChunks = true;
      break;
    }
    
    offset += 12 + chunkLength; // 4 (length) + 4 (type) + chunkLength + 4 (CRC)
  }
  
  return result;
}

function parseWebpMetadata(data: Uint8Array): { hasMetadata: boolean; hasExif: boolean } {
  const result = { hasMetadata: false, hasExif: false };
  
  // WebP signature check
  if (data.length < 12 || 
      String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'RIFF' ||
      String.fromCharCode(data[8], data[9], data[10], data[11]) !== 'WEBP') {
    return result;
  }
  
  let offset = 12;
  
  while (offset < data.length - 8) {
    const chunkType = String.fromCharCode(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
    const chunkSize = readUint32(data, offset + 4, 'little');
    
    if (chunkType === 'EXIF') {
      result.hasExif = true;
      result.hasMetadata = true;
    } else if (chunkType === 'XMP ' || chunkType === 'ICCP') {
      result.hasMetadata = true;
    }
    
    offset += 8 + chunkSize + (chunkSize % 2); // Padding to even boundary
  }
  
  return result;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}
