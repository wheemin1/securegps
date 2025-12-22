import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showReload) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <div className="bg-card border border-border rounded-lg shadow-xl p-4 flex items-center space-x-3 max-w-md">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            New version available
          </p>
          <p className="text-xs text-muted-foreground">
            Update now for the latest features
          </p>
        </div>
        <Button 
          onClick={handleUpdate}
          size="sm"
          className="flex-shrink-0"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
      </div>
    </div>
  );
}
