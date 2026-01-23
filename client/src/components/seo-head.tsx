import { DEFAULT_LANG_URL, LANGUAGES, getPathSuffixForLang, isSupportedLangUrl } from '@/lib/constants';
import { useEffect } from 'react';

type SeoHeadProps = {
  langUrl: string;
  title: string;
  description: string;
};

function getSiteOrigin(): string {
  const configured = (import.meta as any)?.env?.VITE_SITE_URL;
  const origin = typeof configured === 'string' && configured.length > 0
    ? configured
    : (typeof window !== 'undefined' ? window.location.origin : '');

  return origin.replace(/\/$/, '');
}

export default function SeoHead({ langUrl, title, description }: SeoHeadProps) {
  useEffect(() => {
    const origin = getSiteOrigin();
    const safeLangUrl = isSupportedLangUrl(langUrl) ? langUrl : DEFAULT_LANG_URL;

    const pathname = window.location.pathname || `/${safeLangUrl}`;
    const suffix = getPathSuffixForLang(pathname, safeLangUrl);

    const canonical = origin ? `${origin}/${safeLangUrl}${suffix}` : null;

    const currentHreflang = LANGUAGES[safeLangUrl]?.hreflang ?? DEFAULT_LANG_URL;
    const ogLocale = currentHreflang.replace('-', '_');

    document.documentElement.lang = currentHreflang;
    document.title = title;

    const ensureMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
    };

    const ensureLink = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
    };

    ensureMeta('meta[name="description"]', { name: 'description', content: description });

    if (canonical) {
      ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
      ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    }

    ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: ogLocale });

    // Rebuild hreflang alternates each time (avoid duplicates)
    document.head.querySelectorAll('link[data-i18n-hreflang="true"]').forEach((el) => el.remove());

    if (origin) {
      Object.values(LANGUAGES).forEach((lang) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', lang.hreflang);
        link.setAttribute('href', `${origin}/${lang.url}${suffix}`);
        link.setAttribute('data-i18n-hreflang', 'true');
        document.head.appendChild(link);
      });

      const xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      xDefault.setAttribute('href', `${origin}/${DEFAULT_LANG_URL}${suffix}`);
      xDefault.setAttribute('data-i18n-hreflang', 'true');
      document.head.appendChild(xDefault);
    }
  }, [description, langUrl, title]);

  return null;
}
