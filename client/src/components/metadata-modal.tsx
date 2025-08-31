import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import { Info, X, CheckCircle } from 'lucide-react';

export function MetadataModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary hover:text-primary/80 underline"
          data-testid="button-metadata-info"
        >
          <span className="text-sm font-medium">{t('metadata.title')}</span>
          <Info className="w-4 h-4 ml-1" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" data-testid="modal-metadata-info">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t('metadata.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4">
            {/* GPS & Location Data */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500" />
                <span>{t('metadata.gps.title')}</span>
              </h4>
              <ul className="text-muted-foreground space-y-1 ml-6">
                {Array.isArray(t('metadata.gps.items')) 
                  ? t('metadata.gps.items').map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))
                  : <li>• {t('metadata.gps.items')}</li>
                }
              </ul>
            </div>
            
            {/* Device Information */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500" />
                <span>{t('metadata.device.title')}</span>
              </h4>
              <ul className="text-muted-foreground space-y-1 ml-6">
                {Array.isArray(t('metadata.device.items')) 
                  ? t('metadata.device.items').map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))
                  : <li>• {t('metadata.device.items')}</li>
                }
              </ul>
            </div>
            
            {/* Timestamps */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500" />
                <span>{t('metadata.timestamps.title')}</span>
              </h4>
              <ul className="text-muted-foreground space-y-1 ml-6">
                {Array.isArray(t('metadata.timestamps.items')) 
                  ? t('metadata.timestamps.items').map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))
                  : <li>• {t('metadata.timestamps.items')}</li>
                }
              </ul>
            </div>
            
            {/* Other Metadata */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500" />
                <span>{t('metadata.other.title')}</span>
              </h4>
              <ul className="text-muted-foreground space-y-1 ml-6">
                {Array.isArray(t('metadata.other.items')) 
                  ? t('metadata.other.items').map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))
                  : <li>• {t('metadata.other.items')}</li>
                }
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">{t('metadata.preserved.title')}</div>
                <div className="text-muted-foreground">{t('metadata.preserved.description')}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
