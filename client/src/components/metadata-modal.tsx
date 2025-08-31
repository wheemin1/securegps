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
          <div className="space-y-3">
            <p className="text-muted-foreground mb-4">We remove these types of metadata from your images:</p>
            
            {/* Key examples list */}
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span><strong>GPS coordinates</strong> - Location where photo was taken</span>
              </li>
              <li className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span><strong>Device information</strong> - Camera/phone model and serial numbers</span>
              </li>
              <li className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span><strong>Timestamps</strong> - When photo was taken, created, or modified</span>
              </li>
              <li className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span><strong>Software details</strong> - Apps and versions used to edit/process</span>
              </li>
              <li className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span><strong>Embedded previews</strong> - Hidden thumbnail and preview images</span>
              </li>
            </ul>
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
