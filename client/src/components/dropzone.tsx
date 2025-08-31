import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { Upload, Shield, Lock, Zap, RotateCcw } from 'lucide-react';

export function Dropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, processFiles, reset } = useImageProcessor();
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      processFiles(Array.from(files));
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

  if (state.status === 'processing') {
    return (
      <div className="border-2 border-primary rounded-2xl p-12 text-center bg-primary/5">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-primary animate-spin" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('processing.cleaning', { current: state.processed, total: state.total })}
            </h2>
            <p className="text-muted-foreground mb-6">{t('processing.removing')}</p>
            
            <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="progress-bar h-full rounded-full transition-all duration-300" 
                style={{ '--progress': `${state.progress}%` } as React.CSSProperties}
              />
            </div>
            
            <div className="text-sm text-muted-foreground" aria-live="polite">
              {state.currentFile && (
                <span data-testid="text-current-file">
                  {t('processing.currentFile', { filename: state.currentFile })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className="border-2 border-green-500 rounded-2xl p-8 text-center bg-green-50 dark:bg-green-950">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400 checkmark-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-3" data-testid="text-success-message">
              All clean. Safe to share.
            </h2>
            
            {/* Result feedback card */}
            <div className="bg-white dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    {state.processed}
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Files cleaned
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    GPS, EXIF
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Removed
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    100%
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Private
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-green-700 dark:text-green-300 mb-6 text-sm" data-testid="text-success-details">
              {state.message}
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={reset}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-clean-more"
              >
                Clean another batch
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropzone-container">
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 dropzone-pattern cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          isDragOver 
            ? 'border-primary bg-primary/10 scale-102 shadow-lg' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5 bg-muted/20'
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
        aria-label={t('dropzone.title')}
        data-testid="dropzone-area"
      >
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-dropzone-title">
              {t('dropzone.title')}
            </h2>
            <p className="text-muted-foreground mb-2" data-testid="text-supported-formats">
              {t('dropzone.supportedFormats')}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Tip: You can also paste images with Ctrl/⌘+V
            </p>
            
            <Button 
              onClick={openFileDialog}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-choose-files"
            >
              {t('dropzone.chooseFiles')}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>{t('dropzone.features.noUpload')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>{t('dropzone.features.private')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>{t('dropzone.features.instant')}</span>
            </div>
          </div>
          
          {/* HEIC/AVIF notice */}
          <div className="text-xs text-muted-foreground mt-4">
            HEIC/AVIF support depends on your browser. If unsupported, we'll suggest a safe JPEG convert.
          </div>
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
