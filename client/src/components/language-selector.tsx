import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { isSupportedLangUrl } from '@/lib/constants';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, languages } = useLanguage();

  const handleLanguageClick = (languageCode: string) => {
    console.log('🎯 Language button clicked:', languageCode);

    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const segments = pathname.split('/').filter(Boolean);
    const first = segments[0];

    const hasLangPrefix = isSupportedLangUrl(first);
    const suffix = hasLangPrefix
      ? (segments.length > 1 ? `/${segments.slice(1).join('/')}` : '')
      : pathname;

    const target = `/${languageCode}${suffix}${search}${hash}`;
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
        data-testid="button-language-selector"
      >
        <span className={`language-flag ${currentLanguage?.flag}`} />
        <span className="text-sm font-medium">{currentLanguage?.name}</span>
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </Button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => handleLanguageClick(language.code)}
                  data-testid={`button-language-${language.code}`}
                >
                  <span className={`language-flag ${language.flag}`} />
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
