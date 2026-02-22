import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  fileCount: number;
}

export function ShareButtons({ fileCount }: ShareButtonsProps) {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const translations: Record<string, string> = {
      en: `I just removed GPS tracking from ${fileCount} photo${fileCount > 1 ? 's' : ''} in 30 seconds — 100% free & offline! 🔒`,
      ko: `30초만에 사진 ${fileCount}장에서 GPS 추적 제거 완료 — 100% 무료/오프라인! 🔒`,
      es: `Acabo de eliminar el rastreo GPS de ${fileCount} foto${fileCount > 1 ? 's' : ''} en 30 segundos — ¡100% gratis y offline! 🔒`,
      ja: `30秒で${fileCount}枚の写真からGPS追跡を削除しました — 100%無料＆オフライン！🔒`,
      de: `Ich habe gerade GPS-Tracking von ${fileCount} Foto${fileCount > 1 ? 's' : ''} in 30 Sekunden entfernt — 100% kostenlos & offline! 🔒`,
      fr: `Je viens de supprimer le suivi GPS de ${fileCount} photo${fileCount > 1 ? 's' : ''} en 30 secondes — 100% gratuit et offline ! 🔒`,
      'pt-br': `Acabei de remover rastreamento GPS de ${fileCount} foto${fileCount > 1 ? 's' : ''} em 30 segundos — 100% grátis e offline! 🔒`,
      id: `Saya baru saja menghapus pelacakan GPS dari ${fileCount} foto dalam 30 detik — 100% gratis & offline! 🔒`,
      hi: `मैंने अभी 30 सेकंड में ${fileCount} फोटो से GPS ट्रैकिंग हटा दिया — 100% मुफ्त और ऑफलाइन! 🔒`,
      tl: `Tinanggal ko ang GPS tracking mula sa ${fileCount} litrato sa loob ng 30 segundo — 100% libre at offline! 🔒`
    };

    return translations[currentLanguage.code] || translations.en;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://securegps.netlify.app';
  const shareText = getShareText();
  const fullShareText = `${shareText}\n\n${shareUrl}`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
      
      toast({
        title: t('share.copied.title') || 'Copied!',
        description: t('share.copied.description') || 'Share text copied to clipboard',
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: t('share.error.title') || 'Error',
        description: t('share.error.description') || 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Share2 className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">
          {t('share.title') || 'Share with friends'}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* WhatsApp - Critical for developing markets */}
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          size="sm"
          className="h-10 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 text-foreground"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </Button>

        {/* Twitter/X */}
        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="h-10 px-4 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-border"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </Button>

        {/* Copy Link */}
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="h-10 px-4"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              {t('share.copied.short') || 'Copied!'}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              {t('share.copyLink') || 'Copy Link'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
