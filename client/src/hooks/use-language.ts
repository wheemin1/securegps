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

export function useLanguage() {
  // 기본값을 명시적으로 설정
  const getDefaultLanguage = () => {
    const saved = localStorage.getItem('language');
    if (saved) {
      const found = languages.find(l => l.code === saved);
      if (found) return found;
    }
    return languages[1]; // 한국어 기본값
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getDefaultLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  console.log('🌐 useLanguage hook initialized with:', {
    code: currentLanguage?.code,
    name: currentLanguage?.name,
    flag: currentLanguage?.flag
  });

  // 언어가 변경될 때마다 번역 파일 로드
  useEffect(() => {
    const loadTranslations = async () => {
      console.log('🌐 Loading translations for:', currentLanguage.code);
      setIsLoading(true);
      
      try {
        const module = await import(`../i18n/${currentLanguage.code}.json`);
        console.log('🌐 Translations loaded successfully:', currentLanguage.code);
        setTranslations(module.default);
      } catch (error) {
        console.error('🌐 Failed to load translations for', currentLanguage.code, error);
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
    };

    loadTranslations();
  }, [currentLanguage.code]); // currentLanguage.code로 의존성 변경

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
    localStorage.setItem('language', languageCode);
    
    console.log('🌐 Language change completed');
  }, []); // 의존성 배열을 비워서 무한 리렌더링 방지

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
