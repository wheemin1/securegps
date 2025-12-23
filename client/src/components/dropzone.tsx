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
        className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 glass dark:glass-dark ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 scale-[1.02] shadow-xl' 
            : 'border-white/20 dark:border-white/10 hover:border-blue-500/50 backdrop-blur-sm'
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
        {/* Gradient Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        
        {/* Main Content */}
        <div className="relative space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full gradient-blue flex items-center justify-center shadow-lg">
            <Upload className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2" data-testid="text-dropzone-title">
              Drop Photos Here
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              or tap to select from your device
            </p>
            
            <Button 
              onClick={openFileDialog}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              data-testid="button-choose-files"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Photos
            </Button>
          </div>
          
          {/* Format Badges */}
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 bg-white/50 dark:bg-black/30 backdrop-blur-sm text-xs rounded-full font-medium">
              JPG
            </span>
            <span className="px-3 py-1 bg-white/50 dark:bg-black/30 backdrop-blur-sm text-xs rounded-full font-medium">
              PNG
            </span>
            <span className="px-3 py-1 bg-white/50 dark:bg-black/30 backdrop-blur-sm text-xs rounded-full font-medium">
              WebP
            </span>
          </div>
          
          {/* Trust Badges - Subtle */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Private</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Offline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Instant</span>
            </div>
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
