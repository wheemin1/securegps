import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { MetadataPreview } from '@/components/metadata-preview';
import { Upload, Shield, Lock, Zap, RotateCcw, CheckCircle, FileCheck, Trash2 } from 'lucide-react';

export function Dropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, previewFiles, confirmProcessing, reset } = useImageProcessor();
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      previewFiles(Array.from(files));
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
    return (
      <div className="border-2 border-primary rounded-2xl p-12 text-center bg-primary/5 fade-in-up">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-primary progress-pulse" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('processing.cleaning', { current: state.processed, total: state.total })}
            </h2>
            <p className="text-muted-foreground mb-6">{t('processing.removing')}</p>
            
            {/* Enhanced Progress Bar */}
            <div className="max-w-md mx-auto">
              <Progress value={state.progress} className="h-4 mb-4 slide-in" />
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                <span>{state.processed} / {state.total} {t('processing.filesCompleted') || 'files completed'}</span>
                <span className="font-semibold text-primary">{Math.round(state.progress)}%</span>
              </div>
            </div>
            
            {/* Current File Info */}
            <div className="text-sm text-muted-foreground mb-4" aria-live="polite">
              {state.currentFile && (
                <div className="flex items-center justify-center space-x-2 fade-in-up">
                  <FileCheck className="w-4 h-4 progress-pulse" />
                  <span data-testid="text-current-file" className="font-medium">
                    {t('processing.currentFile', { filename: state.currentFile })}
                  </span>
                </div>
              )}
            </div>
            
            {/* Processing Steps Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2 step-indicator">
                <div className="w-2 h-2 bg-primary rounded-full progress-pulse"></div>
                <span>{t('processing.step.reading') || 'Reading metadata'}</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center space-x-2 step-indicator">
                <div className="w-2 h-2 bg-primary rounded-full progress-pulse" style={{animationDelay: '0.5s'}}></div>
                <span>{t('processing.step.cleaning') || 'Cleaning image'}</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center space-x-2 step-indicator">
                <div className="w-2 h-2 bg-primary rounded-full progress-pulse" style={{animationDelay: '1s'}}></div>
                <span>{t('processing.step.finalizing') || 'Finalizing'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className="border-2 border-green-500 rounded-2xl p-8 text-center bg-green-50 dark:bg-green-950 success-card">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-3" data-testid="text-success-message">
              {t('success.title') || 'All clean. Safe to share.'}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              {state.message}
            </p>
            
            {/* Enhanced Result feedback card */}
            <div className="bg-white dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6 mx-auto max-w-md success-stats">
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
            
            <Button 
              onClick={reset} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-semibold"
            >
              <Upload className="w-5 h-5 mr-2" />
              {t('success.processMore') || 'Process more images'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropzone-container relative">
      <div 
        className={`toss-card cursor-pointer transition-all ${
          isDragOver 
            ? 'shadow-lg border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[0.99]' 
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
        aria-label="Tap to select photos"
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
              Tap to select photos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG, WebP supported
            </p>
          </div>
          
          {/* Button */}
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); openFileDialog(); }}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
            data-testid="button-choose-files"
          >
            Select Photos
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
