import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { MetadataPreview } from '@/components/metadata-preview';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Upload, Shield, Lock, Zap, RotateCcw, CheckCircle, FileCheck, Trash2, X, AlertTriangle, Loader2, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function Dropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, previewFiles, addFilesToQueue, removeFileFromQueue, startBatchProcessing, confirmProcessing, downloadResults, reset } = useImageProcessor();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const previousStatusRef = useRef<string>('');

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallSheet, setShowInstallSheet] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    const prev = previousStatusRef.current;
    previousStatusRef.current = state.status;

    if (prev === 'processing' && state.status === 'result') {
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

      const downloadKind = state.download?.kind;
      const count = state.download?.count;
      const isZip = downloadKind === 'zip';

      toast({
        title: t('toast.processingComplete.title'),
        description: isZip
          ? (typeof count === 'number'
            ? t('toast.processingComplete.zipReadyWithCount', { count })
            : t('toast.processingComplete.zipReady'))
          : t('toast.processingComplete.singleReady'),
      });
    }
  }, [state.status, state.download, toast, t]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const terminalSteps = useMemo(() => {
    const value = t('dropzone.processing.terminalSteps');
    return Array.isArray(value) ? value : [String(value)];
  }, [t]);

  const [terminalIndex, setTerminalIndex] = useState(0);

  const scanSteps = useMemo(
    () => {
      const hasGpsCoords = (state.queuedMetadata || []).some(
        (m) => Boolean(m.hasGps && m.location)
      );
      const hasGpsTagsOnly = !hasGpsCoords && (state.queuedMetadata || []).some(
        (m) => Boolean(m.hasGps)
      );

      const lastLine = hasGpsCoords
        ? t('dropzone.scan.foundCoords')
        : hasGpsTagsOnly
          ? t('dropzone.scan.foundTagsOnly')
          : t('dropzone.scan.noGps');

      return [
        t('dropzone.scan.readingExif'),
        t('dropzone.scan.detectingGps'),
        t('dropzone.scan.checkingDevice'),
        t('dropzone.scan.buildingReport'),
        lastLine
      ];
    },
    [state.queuedMetadata, t]
  );
  const [scanIndex, setScanIndex] = useState(0);

  useEffect(() => {
    if (!showScanOverlay) {
      setScanIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setScanIndex((prev) => Math.min(prev + 1, scanSteps.length - 1));
    }, 350);

    return () => clearInterval(interval);
  }, [showScanOverlay, scanSteps.length]);

  useEffect(() => {
    if (state.status !== 'processing') {
      setTerminalIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setTerminalIndex((prev) => {
        const next = prev + 1;
        return next >= terminalSteps.length ? terminalSteps.length - 1 : next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [state.status, terminalSteps.length]);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      addFilesToQueue(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set to false if we're leaving the dropzone completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFileDialog();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageFiles: File[] = [];
    
    items.forEach(item => {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    });
    
    if (imageFiles.length > 0) {
      handleFileSelect(imageFiles);
    }
  };

  if (state.status === 'queued' && state.queuedFiles && state.queuedMetadata) {
    return (
      <>
        <div className="toss-card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {state.queuedFiles.length === 1
                ? t('dropzone.queue.readyTitleSingle', { count: state.queuedFiles.length })
                : t('dropzone.queue.readyTitleMultiple', { count: state.queuedFiles.length })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dropzone.queue.readySubtitle')}
            </p>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {state.queuedFiles.map((file, index) => {
              const meta = state.queuedMetadata![index];
              const hasWarning = meta.metadataFound.length > 0;
              
              return (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      hasWarning ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {hasWarning ? (
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      ) : (
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{meta.fileType.replace('image/', '').toUpperCase()}</span>
                        {hasWarning && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                              {t('dropzone.queue.metadataCount', { count: meta.metadataFound.length })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFileFromQueue(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    aria-label={t('dropzone.queue.removeFileAria')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                if (showScanOverlay) return;
                setShowScanOverlay(true);
                setTimeout(() => {
                  startBatchProcessing();
                  setShowScanOverlay(false);
                }, 1500);
              }}
              disabled={showScanOverlay}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-semibold rounded-xl shadow-sm transition-colors"
            >
              {showScanOverlay ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('dropzone.queue.scanning')}
                </>
              ) : (
                <>
                  {state.queuedFiles.length === 1
                    ? t('dropzone.queue.cleanButtonSingle', { count: state.queuedFiles.length })
                    : t('dropzone.queue.cleanButtonMultiple', { count: state.queuedFiles.length })}
                </>
              )}
            </Button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={showScanOverlay}
              className="w-full h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-medium rounded-xl transition-colors"
            >
              {t('dropzone.queue.addMore')}
            </button>
          </div>
        </div>

        {showScanOverlay && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              </div>
              <div className="text-center mb-3">
                <h2 className="text-xl font-semibold text-foreground">{t('dropzone.queue.scanningMetadataTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('dropzone.queue.scanningMetadataSubtitle')}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="font-mono text-xs text-foreground/90 truncate">
                  {scanSteps[scanIndex]}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(Array.from(e.target.files));
            }
          }}
          data-testid="input-file-select"
        />
      </>
    );
  }

  if (state.status === 'preview' && state.selectedFiles && state.previewData) {
    return (
      <MetadataPreview 
        files={state.selectedFiles}
        metadata={state.previewData}
        onConfirm={confirmProcessing}
        onCancel={reset}
      />
    );
  }

  if (state.status === 'processing') {
    const activeIndexByProgress = Math.min(
      terminalSteps.length - 1,
      Math.floor((Math.min(state.progress, 99) / 100) * (terminalSteps.length - 1))
    );
    const activeIndex = Math.max(terminalIndex, activeIndexByProgress);
    const visibleLines = terminalSteps.slice(Math.max(0, activeIndex - 3), activeIndex + 1);

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {t('dropzone.processing.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('dropzone.processing.subtitle')}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Progress value={state.progress} className="h-4 mb-3" />
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
              <span>{state.processed} / {state.total} {t('processing.filesCompleted')}</span>
              <span className="font-semibold text-primary">{Math.round(state.progress)}%</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-3" aria-live="polite">
            {state.currentFile && (
              <div className="flex items-center justify-center space-x-2">
                <FileCheck className="w-4 h-4" />
                <span data-testid="text-current-file" className="font-medium">
                  {t('processing.currentFile', { filename: state.currentFile })}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3 mb-4">
            <div className="font-mono text-xs text-foreground/90 space-y-1">
              {visibleLines.map((line) => (
                <div key={line} className="truncate">{line}</div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-[300px]">
              <div className="w-full h-[250px] rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                {t('ads.placeholder')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'result') {
    return (
      <div className="rounded-2xl p-8 text-center bg-green-50/50 dark:bg-green-950/30 success-card relative">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-3" data-testid="text-success-message">
              {t('success.title') || 'All clean. Safe to share.'}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              {state.download?.kind === 'zip'
                ? t('success.multipleFiles', {
                  count: state.download.count,
                  filename: state.download.filename
                })
                : t('success.singleFile', {
                  filename: state.download?.filename || ''
                })}
            </p>

            <Button
              onClick={async () => {
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate(30);
                }
                await downloadResults();
                if (!isStandalone && installPrompt) {
                  setShowInstallSheet(true);
                }
              }}
              className="w-full md:w-auto h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 text-base font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              {state.download?.kind === 'zip' ? t('success.downloadZip') : t('success.downloadSingle')}
            </Button>
            
            {/* Enhanced Result feedback card */}
            <div className="bg-white dark:bg-gray-800 border-none rounded-xl p-6 mb-6 mx-auto max-w-md shadow-sm success-stats">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                    {state.processed}
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-xs">
                    {t('success.stats.files') || 'Files cleaned'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                    <Shield className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-xs">
                    {t('success.stats.metadata') || 'Metadata removed'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                    100%
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-xs">
                    {t('success.stats.privacy') || 'Privacy safe'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={reset} 
                variant="ghost"
                className="w-full md:w-auto h-12 text-foreground px-8 text-sm font-semibold rounded-xl transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                {t('success.processMore') || 'Process more images'}
              </Button>
            </div>

            {/* Deletion Log (receipt) */}
            {state.deletionLog && state.deletionLog.some(section => section.entries.length > 0) && (
              <div className="mt-6 mx-auto max-w-md text-left">
                <div className="rounded-xl bg-white/70 dark:bg-gray-900/40 border border-border p-4">
                  <div className="text-sm font-semibold text-foreground mb-2">{t('deletionLog.title')}</div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="log">
                      <AccordionTrigger className="py-2 text-sm">
                        {t('deletionLog.trigger')}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="space-y-4">
                          {state.deletionLog.map((section) => (
                            <div key={section.fileName} className="rounded-lg border border-border bg-background/40 p-3">
                              <div className="text-xs font-semibold text-foreground mb-2 truncate">
                                {section.fileName}
                              </div>
                              <div className="space-y-2">
                                {section.entries.length === 0 ? (
                                  <div className="text-xs text-muted-foreground">{t('deletionLog.none')}</div>
                                ) : (
                                  section.entries.map((entry) => (
                                    <div key={`${entry.label}-${entry.before}`} className="text-xs flex items-center justify-between gap-3">
                                      <div className="text-muted-foreground">{entry.label}</div>
                                      <div className="font-mono text-right">
                                        <span className="text-foreground/80">{entry.before}</span>
                                        <span className="text-muted-foreground"> → </span>
                                        <span className="text-red-600 font-semibold">{t('deletionLog.removed')}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post-download PWA install bottom sheet */}
        {showInstallSheet && !isStandalone && installPrompt && (
          <div className="fixed inset-x-0 bottom-0 z-50 p-4">
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card shadow-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {t('pwa.nudge.title')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('pwa.nudge.description')}
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallSheet(false)}
                  className="text-muted-foreground hover:text-foreground text-sm"
                  aria-label={t('ui.dismiss')}
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={async () => {
                    try {
                      await installPrompt.prompt();
                      await installPrompt.userChoice;
                    } finally {
                      setInstallPrompt(null);
                      setShowInstallSheet(false);
                    }
                  }}
                >
                  {t('pwa.nudge.installButton')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInstallSheet(false)}
                >
                  {t('pwa.nudge.notNow')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dropzone-container relative">
      <div 
        className={`toss-card cursor-pointer transition-all ${
          isDragOver 
            ? 'shadow-lg border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[0.99] animate-pulse' 
            : 'hover:shadow-md active:scale-[0.99]'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        tabIndex={0}
        role="button"
        aria-label={t('dropzone.idle.ariaTapToSelect')}
        data-testid="dropzone-area"
      >
        <div className="text-center space-y-4 py-8">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Text */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1" data-testid="text-dropzone-title">
              {t('dropzone.idle.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dropzone.idle.subtitle')}
            </p>
          </div>
          
          {/* Button */}
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); openFileDialog(); }}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
            data-testid="button-choose-files"
          >
            {t('dropzone.chooseFiles')}
          </button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(Array.from(e.target.files));
          }
        }}
        data-testid="input-file-select"
      />
    </div>
  );
}
