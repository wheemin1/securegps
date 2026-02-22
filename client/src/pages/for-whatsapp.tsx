import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import Footer from '@/components/footer';
import { useLanguage } from '@/hooks/use-language';
import { Shield, MessageCircle, Users, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ForWhatsApp() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Remove GPS from WhatsApp Photos | Safe Family Photo Sharing";
  }, []);

  const scrollToTool = () => {
    const dropzone = document.getElementById('tool');
    if (dropzone) {
      dropzone.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg 
                className="w-8 h-8 text-primary" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  SecureGPS
                </h1>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section - WhatsApp Focused */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Remove GPS from <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">WhatsApp Photos</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Share photos safely with family and friends. Remove location data before sending on WhatsApp — protect your home address.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-300 font-medium">Family Safe</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">No Upload</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-300 font-medium">Works Offline</span>
            </div>
          </div>

          <Button 
            onClick={scrollToTool}
            size="lg"
            className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            Clean Photos for WhatsApp
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>

        {/* Why WhatsApp Users Need This */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Remove GPS Before Sharing on WhatsApp
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Reason 1 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Protect Your Family</h3>
              <p className="text-muted-foreground text-sm">
                Photos of kids at home, school, or parks contain GPS coordinates. Remove location data to protect your children's safety when sharing in family groups.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">WhatsApp Forwards</h3>
              <p className="text-muted-foreground text-sm">
                Your photos can be forwarded to strangers. GPS metadata travels with the photo. Remove it before sending to prevent location leaks.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Group Chat Safety</h3>
              <p className="text-muted-foreground text-sm">
                WhatsApp groups have many members, some you may not know well. Don't reveal your home location through photo metadata in group chats.
              </p>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-1">
            <div className="bg-background rounded-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Remove GPS from Your WhatsApp Photos
              </h2>
              <Dropzone />
            </div>
          </div>
        </section>

        {/* WhatsApp FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            WhatsApp Privacy FAQs
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Does WhatsApp remove GPS data from photos?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                No. WhatsApp compresses photos but <strong>does NOT remove GPS metadata.</strong> If your original photo has GPS coordinates, they remain in the WhatsApp version. Remove GPS yourself before sending.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Can people in my WhatsApp group see where I live?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes, if you send photos with GPS metadata. Anyone in the group can download the photo and extract GPS coordinates showing your exact location. Remove GPS before sharing.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Is this safe for family photos?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes! This tool works 100% offline. Your family photos never leave your device. No upload, no storage, no tracking. Perfect for protecting children's privacy.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                What if my photo is forwarded many times?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                GPS metadata stays in the photo even after multiple forwards. By removing GPS before sending, you ensure your location is protected no matter how many times it's shared.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Share Safely on WhatsApp
            </h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Protect your family's privacy. Remove GPS before sharing photos in WhatsApp groups and chats.
            </p>
            <Button 
              onClick={scrollToTool}
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-green-600 hover:bg-gray-100"
            >
              Start Cleaning Photos
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
