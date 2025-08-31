import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
        data-testid="button-language-selector"
      >
        <span className={`language-flag ${currentLanguage.flag}`} />
        <span className="text-sm font-medium">{currentLanguage.name}</span>
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
                  onClick={() => {
                    changeLanguage(language.code);
                    setIsOpen(false);
                  }}
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
