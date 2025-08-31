import { useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: 'flag-en' },
  { code: 'ko', name: '한국어', flag: 'flag-ko' },
  { code: 'es', name: 'Español', flag: 'flag-es' },
  { code: 'ja', name: '日本語', flag: 'flag-ja' },
];

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLanguage(lang);
      }
    }
  }, []);

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const module = await import(`../i18n/${currentLanguage.code}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        const fallback = await import('../i18n/en.json');
        setTranslations(fallback.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = (languageCode: string) => {
    const lang = languages.find(l => l.code === languageCode);
    if (lang) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', languageCode);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): any => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // If it's an array, return it as is
    if (Array.isArray(value)) {
      return value;
    }

    let result = typeof value === 'string' ? value : key;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, val]) => {
        result = result.replace(`{${param}}`, String(val));
      });
    }

    return result;
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    languages
  };
}
