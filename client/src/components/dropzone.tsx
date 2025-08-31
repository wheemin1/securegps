import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { Upload, Shield, Lock, Zap, RotateCcw } from 'lucide-react';

export function Dropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, processFiles, reset } = useImageProcessor();
  const { t } = useLanguage();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
      <div className="border-2 border-green-500 rounded-2xl p-12 text-center bg-green-50 dark:bg-green-950">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400 checkmark-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-2" data-testid="text-success-message">
              {t('success.allClean')}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6" data-testid="text-success-details">
              {state.message}
            </p>
            
            <Button
              onClick={reset}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-clean-more"
            >
              {t('success.cleanMore')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropzone-container">
      <div 
        className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 dropzone-pattern bg-muted/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
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
            <p className="text-muted-foreground mb-6" data-testid="text-supported-formats">
              {t('dropzone.supportedFormats')}
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
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/avif"
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
