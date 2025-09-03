import { FileMetadata } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Camera, FileImage, HardDrive, Calendar, Shield, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface MetadataPreviewProps {
  files: File[];
  metadata: FileMetadata[];
  onConfirm: (files?: File[]) => void;
  onCancel: () => void;
}

export function MetadataPreview({ files, metadata, onConfirm, onCancel }: MetadataPreviewProps) {
  const { t } = useLanguage();

  const totalMetadataItems = metadata.reduce((sum, meta) => sum + meta.metadataFound.length, 0);
  const hasGps = metadata.some(meta => meta.hasGps);
  const hasGpsLocation = metadata.some(meta => meta.hasGps && meta.location);
  const hasExif = metadata.some(meta => meta.hasExif);

  // GPS가 있는 첫 번째 파일의 위치 정보 가져오기
  const gpsMetadata = metadata.find(meta => meta.hasGps && meta.location);

  return (
    <div className="border-2 border-orange-500 rounded-2xl p-6 bg-orange-50 dark:bg-orange-950">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
            {t('preview.title')}
          </h2>
          <p className="text-orange-700 dark:text-orange-300">
            {t('preview.subtitle', { count: totalMetadataItems, fileCount: files.length })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={hasGps ? "border-red-200 bg-red-50 dark:bg-red-950" : "border-gray-200"}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <MapPin className={`w-4 h-4 ${hasGps ? 'text-red-600' : 'text-gray-400'}`} />
                <span>{t('preview.gpsTitle') || 'GPS Location'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {hasGpsLocation && gpsMetadata?.location ? (
                  <div>
                    <Badge variant="destructive" className="text-xs">
                      {t('preview.gpsFound')} - Location Data
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lat: {gpsMetadata.location.latitude.toFixed(6)}<br/>
                      Lon: {gpsMetadata.location.longitude.toFixed(6)}
                    </div>
                  </div>
                ) : hasGps ? (
                  <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                    GPS Tags Only (No Coordinates)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {t('preview.gpsNone')}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                {hasGps ? t('preview.gpsDescription') : t('preview.gpsNoDescription')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className={hasExif ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950" : "border-gray-200"}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Camera className={`w-4 h-4 ${hasExif ? 'text-yellow-600' : 'text-gray-400'}`} />
                <span>Camera Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {hasExif ? (
                  <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                    Found
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    None
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                {hasExif ? "EXIF data will be removed" : "No camera data detected"}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <FileImage className="w-4 h-4 text-blue-600" />
                <span>Files</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {files.length}
              </div>
              <CardDescription className="text-xs mt-1">
                {files.length === 1 ? 'File' : 'Files'} to be cleaned
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Detailed File List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {files.map((file, index) => {
            const meta = metadata[index];
            return (
              <Card key={file.name} className="border border-gray-200 bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileImage className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm truncate">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {meta.fileType.replace('image/', '')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{(file.size / 1024).toFixed(1)}KB</span>
                        </div>
                        {meta.dimensions && (
                          <div className="flex items-center space-x-1">
                            <span>{meta.dimensions.width}×{meta.dimensions.height}</span>
                          </div>
                        )}
                      </div>

                      {meta.metadataFound.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {meta.metadataFound.map((metaType, idx) => (
                            <Badge 
                              key={idx} 
                              variant={metaType.includes('GPS') ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              {metaType}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {meta.metadataFound.length === 0 && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs">No metadata detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-6"
          >
            {t('preview.cancelButton')}
          </Button>
          <Button
            onClick={() => {
              console.log('Confirm button clicked!');
              onConfirm(files);
            }}
            className="px-6 bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('preview.confirmButton', { count: totalMetadataItems })}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('preview.privacyNotice')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
