import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DEFAULT_LANG_URL, LANGUAGES } from '@/lib/constants';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = Object.values(LANGUAGES).map((lang) => ({
  code: lang.url,
  name: lang.label,
  flag: lang.flag,
}));

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (languageCode: string) => void;
  t: (key: string, params?: Record<string, string | number>) => any;
  isLoading: boolean;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 초기 언어 가져오기
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
  console.log('🌐 Using default language: English');
  return languages.find((l) => l.code === DEFAULT_LANG_URL) ?? languages[0];
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 번역 파일 로드
  const loadTranslations = useCallback(async (languageCode: string) => {
    console.log('🌐 Loading translations for:', languageCode);
    setIsLoading(true);
    
    try {
      const response = await import(`@/i18n/${languageCode}.json`);
      console.log('🌐 Translations loaded successfully:', languageCode);
      setTranslations(response.default);
    } catch (error) {
      console.error('🌐 Failed to load translations for', languageCode, error);
      // Fallback to English
      try {
        const fallback = await import('@/i18n/en.json');
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

  // 언어 변경될 때마다 번역 로드
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
    
    // React 상태 업데이트 (이것이 모든 컴포넌트에 즉시 반영됨)
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

  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    languages
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// useLanguage 훅을 Context를 사용하도록 변경
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
