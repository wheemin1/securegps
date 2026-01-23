export interface LanguageConfig {
  url: string;
  hreflang: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Record<string, LanguageConfig> = {
  en: { url: 'en', hreflang: 'en', label: 'English', flag: 'flag-en' },
  es: { url: 'es', hreflang: 'es', label: 'Español', flag: 'flag-es' },
  'pt-br': { url: 'pt-br', hreflang: 'pt-BR', label: 'Português (Brasil)', flag: 'flag-pt-br' },
  de: { url: 'de', hreflang: 'de', label: 'Deutsch', flag: 'flag-de' },
  id: { url: 'id', hreflang: 'id', label: 'Bahasa Indonesia', flag: 'flag-id' },
  fr: { url: 'fr', hreflang: 'fr', label: 'Français', flag: 'flag-fr' },
  ja: { url: 'ja', hreflang: 'ja', label: '日本語', flag: 'flag-ja' },
  ko: { url: 'ko', hreflang: 'ko', label: '한국어', flag: 'flag-ko' }
};

export const DEFAULT_LANG_URL = 'en';

export function isSupportedLangUrl(urlSegment: string | undefined | null): urlSegment is keyof typeof LANGUAGES {
  if (!urlSegment) return false;
  return urlSegment.toLowerCase() in LANGUAGES;
}

export function normalizeNavigatorLanguageToUrl(code: string): string | null {
  const normalized = code.trim().replace('_', '-').toLowerCase();

  if (normalized in LANGUAGES) return normalized;

  const primary = normalized.split('-')[0];

  if (primary === 'pt') return 'pt-br';
  if (primary in LANGUAGES) return primary;

  return null;
}

export function detectBestLangUrlFromNavigator(): string {
  if (typeof navigator === 'undefined') return DEFAULT_LANG_URL;

  const candidates = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const hit = normalizeNavigatorLanguageToUrl(candidate);
    if (hit) return hit;
  }

  return DEFAULT_LANG_URL;
}

export function getPathSuffixForLang(pathname: string, langUrl: string): string {
  const prefix = `/${langUrl}`;
  if (!pathname.startsWith(prefix)) return pathname;

  const suffix = pathname.slice(prefix.length);
  return suffix.length === 0 ? '' : suffix;
}
