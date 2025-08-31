import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import { AdvancedPanel } from '@/components/advanced-panel';
import { MetadataModal } from '@/components/metadata-modal';
import { FAQSection } from '@/components/faq-section';
import { useLanguage } from '@/hooks/use-language';
import { Shield, Zap, Monitor, Lock, AlertTriangle, Info } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd"/>
              </svg>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
                {t('app.title')}
              </h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Remove GPS & metadata from photos
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Drop images or click to choose. No upload — runs in your browser.
          </p>
          
          {/* Feature badges bar */}
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium">No upload</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-medium">100% private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium">Instant</span>
            </div>
          </div>
          
          <div className="bg-accent/50 border border-border rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium" data-testid="text-privacy-message">
                {t('hero.privacy')}
              </span>
            </div>
          </div>
        </section>

        {/* Dropzone */}
        <section className="mb-8">
          <Dropzone />
        </section>

        {/* Advanced Panel */}
        <AdvancedPanel />

        {/* Info Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div>
              <MetadataModal />
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      {t('disclaimers.important.title')}
                    </div>
                    <div className="text-yellow-700 dark:text-yellow-300">
                      {t('disclaimers.important.content')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {t('disclaimers.content.title')}
                    </div>
                    <div className="text-blue-700 dark:text-blue-300">
                      {t('disclaimers.content.content')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">{t('features.title')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{t('features.privacy.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('features.privacy.description')}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{t('features.speed.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('features.speed.description')}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Monitor className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{t('features.install.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('features.install.description')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
        
        {/* Ad Banner after FAQ */}
        <section className="bg-muted border border-border rounded-lg py-8 mb-8">
          <div className="container mx-auto px-4 text-center">
            <div className="text-muted-foreground">
              <div className="text-sm font-medium mb-2">Advertisement Space</div>
              <div className="text-xs opacity-70">728x90 or responsive banner (post-FAQ placement)</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2" data-testid="text-footer-title">
              {t('app.title')} - {t('app.tagline')}
            </p>
            <p data-testid="text-footer-description">
              {t('footer.description')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
