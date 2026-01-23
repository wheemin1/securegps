import { FileMetadata } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Camera, FileImage, HardDrive, Calendar, Shield, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useEffect } from 'react';

interface MetadataPreviewProps {
  files: File[];
  metadata: FileMetadata[];
  onConfirm: (files?: File[]) => void;
  onCancel: () => void;
}

export function MetadataPreview({ files, metadata, onConfirm, onCancel }: MetadataPreviewProps) {
  const { t } = useLanguage();

  // ESC 키로 취소 기능
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const totalMetadataItems = metadata.reduce((sum, meta) => sum + meta.metadataFound.length, 0);
  const hasGps = metadata.some(meta => meta.hasGps);
  const hasGpsLocation = metadata.some(meta => meta.hasGps && meta.location);
  const hasExif = metadata.some(meta => meta.hasExif);
  
  // 기타 메타데이터 계산 (GPS/EXIF 제외)
  const otherMetadata = metadata.reduce((sum, meta) => {
    const otherTypes = meta.metadataFound.filter(
      type => !type.includes('GPS') && !type.includes('EXIF') && !type.includes('Camera')
    );
    return sum + otherTypes.length;
  }, 0);
  
  // 중요한 메타데이터가 있는지 확인
  const hasCriticalMetadata = hasGps || hasExif;
  const hasOnlyOtherMetadata = !hasCriticalMetadata && otherMetadata > 0;

  // GPS가 있는 첫 번째 파일의 위치 정보 가져오기
  const gpsMetadata = metadata.find(meta => meta.hasGps && meta.location);

  // 메타데이터가 없는 경우의 UI
  if (totalMetadataItems === 0) {
    return (
      <div className="rounded-2xl p-6 bg-green-50/50 dark:bg-green-950/50">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t('preview.safeTitle')}
            </h2>
            <p className="text-green-700 dark:text-green-300">
              {t('preview.safeSubtitle', { fileCount: files.length })}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{t('preview.gpsTitle')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {t('preview.gpsNone')}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  {t('preview.gpsNoDescription')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Camera className="w-4 h-4 text-green-600" />
                  <span>{t('preview.cameraTitle')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {t('preview.cameraNone')}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  {t('preview.cameraNoDescription')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <FileImage className="w-4 h-4 text-green-600" />
                  <span>{t('preview.filesTitle')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {files.length}
                </div>
                <CardDescription className="text-xs mt-1">
                  {t('preview.safeFiles')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Detailed File List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {files.map((file, index) => {
              const meta = metadata[index];
              return (
                <Card key={file.name} className="border border-green-200 bg-white dark:bg-gray-800">
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

                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs">{t('preview.noMetadataDetected')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Button - Single Primary CTA */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onConfirm(files)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
            >
              <Shield className="w-5 h-5 mr-2" />
              {t('preview.safeDownload')}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="text-center">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {t('preview.safeNotice')}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Press ESC to go back
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 ${
      hasOnlyOtherMetadata 
        ? 'bg-blue-50/50 dark:bg-blue-950/30' 
        : 'bg-orange-50/50 dark:bg-orange-950/50'
    }`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            hasOnlyOtherMetadata
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-orange-100 dark:bg-orange-900'
          }`}>
            {hasOnlyOtherMetadata ? (
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            )}
          </div>
          <h2 className={`text-2xl font-semibold mb-2 ${
            hasOnlyOtherMetadata
              ? 'text-blue-800 dark:text-blue-200'
              : 'text-orange-800 dark:text-orange-200'
          }`}>
            {hasOnlyOtherMetadata 
              ? 'Location Safe, Minor Data Found'
              : t('preview.title')
            }
          </h2>
          <p className={hasOnlyOtherMetadata
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-orange-700 dark:text-orange-300'
          }>
            {hasOnlyOtherMetadata
              ? `No GPS or camera info, but found ${otherMetadata} other metadata items (XMP, IPTC, etc.)`
              : t('preview.subtitle', { count: totalMetadataItems, fileCount: files.length })
            }
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={hasGps ? "border-none bg-red-50/80 dark:bg-red-950/30 shadow-sm" : "border-none bg-white dark:bg-gray-800 shadow-sm"}>
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
                      {t('preview.gpsFound')} - {t('preview.gpsLocationData')}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lat: {gpsMetadata.location.latitude.toFixed(6)}<br/>
                      Lon: {gpsMetadata.location.longitude.toFixed(6)}
                    </div>

                    {/* Fear visualization (offline-safe) */}
                    <div className="mt-3">
                      <div className="relative overflow-hidden rounded-lg border border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20">
                        <div className="absolute inset-0">
                          <div className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.25),transparent_45%),radial-gradient(circle_at_75%_60%,rgba(59,130,246,0.22),transparent_50%),linear-gradient(135deg,rgba(148,163,184,0.25),rgba(226,232,240,0.10))]" style={{ filter: 'blur(1.5px)' }} />
                          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)', backgroundSize: '18px 18px', filter: 'blur(0.8px)' }} />
                        </div>
                        <div className="relative aspect-[16/9] flex items-center justify-center">
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-red-600 text-white text-[10px] font-semibold tracking-wide">
                            YOUR LOCATION EXPOSED
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="mt-1 text-[10px] text-red-700 dark:text-red-300 font-medium">
                              Precise GPS embedded
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Map preview is blurred for safety.
                      </div>
                    </div>
                  </div>
                ) : hasGps ? (
                  <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                    {t('preview.gpsTagsOnly')}
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

          <Card className={hasExif ? "border-none bg-yellow-50/80 dark:bg-yellow-950/30 shadow-sm" : "border-none bg-white dark:bg-gray-800 shadow-sm"}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Camera className={`w-4 h-4 ${hasExif ? 'text-yellow-600' : 'text-gray-400'}`} />
                <span>{t('preview.cameraTitle')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {hasExif ? (
                  <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                    {t('preview.cameraFound')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {t('preview.cameraNone')}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                {hasExif ? t('preview.cameraDescription') : t('preview.cameraNoDescription')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none bg-blue-50/80 dark:bg-blue-950/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <FileImage className="w-4 h-4 text-blue-600" />
                <span>{t('preview.filesTitle')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {files.length}
              </div>
              <CardDescription className="text-xs mt-1">
                {t('preview.filesToClean')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Detailed File List */}
        <div className="max-h-64 overflow-y-auto space-y-4">
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
                          <span className="text-xs">{t('preview.noMetadata')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Button - Single Primary CTA */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => {
              console.log('Confirm button clicked!');
              if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                // Small haptic to make it feel like an app
                navigator.vibrate(40);
              }
              onConfirm(files);
            }}
            className={`w-full md:w-auto h-14 px-8 text-white text-base font-semibold rounded-xl shadow-sm transition-colors ${
              hasOnlyOtherMetadata
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : (hasCriticalMetadata
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                    : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800')
            }`}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {hasOnlyOtherMetadata
              ? `Clean ${otherMetadata} Minor Items`
              : t('preview.confirmButton', { count: totalMetadataItems })
            }
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('preview.privacyNotice')}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Press ESC to go back
          </div>
        </div>
      </div>
    </div>
  );
}
