import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt";
import SeoHead from "@/components/seo-head";
import ErrorBoundary from "@/components/error-boundary";
import { lazy, Suspense, useEffect } from "react";
import { detectBestLangUrlFromNavigator, DEFAULT_LANG_URL, isSupportedLangUrl } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/home"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));
const ForInstagram = lazy(() => import("@/pages/for-instagram"));
const ForTinder = lazy(() => import("@/pages/for-tinder"));
const ForWhatsApp = lazy(() => import("@/pages/for-whatsapp"));
const Alternatives = lazy(() => import("@/pages/alternatives"));

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/remove-gps" component={Home} />
        <Route path="/metadata-remover" component={Home} />
        <Route path="/photo-privacy" component={Home} />
        <Route path="/exif-remover" component={Home} />
        <Route path="/for-instagram" component={ForInstagram} />
        <Route path="/for-tinder" component={ForTinder} />
        <Route path="/for-whatsapp" component={ForWhatsApp} />
        <Route path="/alternatives" component={Alternatives} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function getBestLangUrlFromStorageOrNavigator(): string {
  try {
    const saved = localStorage.getItem('language');
    if (saved && isSupportedLangUrl(saved)) return saved;
  } catch {
    // ignore
  }
  return detectBestLangUrlFromNavigator();
}

function RootRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const best = getBestLangUrlFromStorageOrNavigator();
    setLocation(`/${best}`, { replace: true });
  }, [setLocation]);

  return null;
}

function LegacyRedirect() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const best = getBestLangUrlFromStorageOrNavigator();
    const target = `/${best}${location}`;
    setLocation(target, { replace: true });
  }, [location, setLocation]);

  return null;
}

function LocalizedShell({ params }: { params: { lang: string } }) {
  const [location, setLocation] = useLocation();
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const langUrl = (params.lang || '').toLowerCase();

  useEffect(() => {
    if (!isSupportedLangUrl(langUrl)) {
      setLocation(`/${DEFAULT_LANG_URL}${location}`, { replace: true });
      return;
    }

    if (currentLanguage.code !== langUrl) {
      changeLanguage(langUrl);
    }
  }, [changeLanguage, currentLanguage.code, langUrl, location, params.lang, setLocation]);

  return (
    <>
      <SeoHead
        langUrl={langUrl}
        title={t('meta.title')}
        description={t('meta.description')}
      />
      <WouterRouter base={`/${langUrl}`}>
        <AppRoutes />
      </WouterRouter>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <PWAUpdatePrompt />
          <PWAInstallPrompt />
          <Switch>
            <Route path="/" component={RootRedirect} />
            <Route path="/:lang/:rest*" component={LocalizedShell} />
            <Route path="/:lang" component={LocalizedShell} />
            <Route component={LegacyRedirect} />
          </Switch>
        </TooltipProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
