import { useState, useEffect, useCallback } from 'react';

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

// 초기 언어 가져오기 (한 번만 실행)
const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('language');
    if (saved) {
      const found = languages.find(l => l.code === saved);
      if (found) {
        console.log('🌐 Found saved language:', found.name);
        return found;
      }
    }
  } catch (error) {
    console.warn('🌐 Error reading from localStorage:', error);
  }
  console.log('🌐 Using default language: 한국어');
  return languages[1]; // 한국어 기본값
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 언어가 변경될 때마다 번역 파일 로드 (useCallback으로 안정화)
  const loadTranslations = useCallback(async (languageCode: string) => {
    console.log('🌐 Loading translations for:', languageCode);
    setIsLoading(true);
    
    try {
      const module = await import(`../i18n/${languageCode}.json`);
      console.log('🌐 Translations loaded successfully:', languageCode);
      setTranslations(module.default);
    } catch (error) {
      console.error('🌐 Failed to load translations for', languageCode, error);
      // Fallback to English
      try {
        const fallback = await import('../i18n/en.json');
        console.log('🌐 Using English fallback translations');
        setTranslations(fallback.default);
      } catch (fallbackError) {
        console.error('🌐 Failed to load fallback translations:', fallbackError);
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드 및 언어 변경 시에만 실행
  useEffect(() => {
    loadTranslations(currentLanguage.code);
  }, [currentLanguage.code, loadTranslations]);

  const changeLanguage = useCallback((languageCode: string) => {
    console.log('🌐 changeLanguage called with:', languageCode);
    
    const newLanguage = languages.find(l => l.code === languageCode);
    if (!newLanguage) {
      console.error('🌐 Language not found:', languageCode);
      return;
    }

    console.log('🌐 Found language:', newLanguage);
    
    // React 상태 업데이트
    setCurrentLanguage(newLanguage);
    
    // localStorage에 저장
    try {
      localStorage.setItem('language', languageCode);
    } catch (error) {
      console.warn('🌐 Error saving to localStorage:', error);
    }
    
    console.log('🌐 Language change completed');
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): any => {
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
  }, [translations]);

  return {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    languages
  };
}
