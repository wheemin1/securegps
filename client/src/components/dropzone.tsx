import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { MetadataPreview } from '@/components/metadata-preview';
import { Upload, Shield, Lock, Zap, RotateCcw, CheckCircle, FileCheck, Trash2, X, AlertTriangle } from 'lucide-react';

export function Dropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, previewFiles, addFilesToQueue, removeFileFromQueue, startBatchProcessing, confirmProcessing, reset } = useImageProcessor();
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);

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
        <div className="toss-card p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {state.queuedFiles.length} {state.queuedFiles.length === 1 ? 'Photo' : 'Photos'} Ready
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add more or start processing
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
                              {meta.metadataFound.length} metadata
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFileFromQueue(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <Button
              onClick={startBatchProcessing}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-semibold rounded-xl shadow-sm transition-colors"
            >
              Clean {state.queuedFiles.length} {state.queuedFiles.length === 1 ? 'Photo' : 'Photos'}
            </Button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-medium rounded-xl transition-colors"
            >
              + Add More Photos
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
    return (
      <div className="rounded-2xl p-8 md:p-12 text-center bg-blue-50/50 dark:bg-blue-950/30 toss-card fade-in-up">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-blue-600 dark:text-blue-400 progress-pulse" />
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
      <div className="rounded-2xl p-8 text-center bg-green-50/50 dark:bg-green-950/30 success-card">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center">
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
            
            <Button 
              onClick={reset} 
              className="w-full md:w-auto h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 text-base font-semibold rounded-xl shadow-sm transition-colors"
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
