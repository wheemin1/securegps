import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import Footer from '@/components/footer';
import { useLanguage } from '@/hooks/use-language';
import { Shield, Heart, MapPin, UserX, AlertCircle, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ForTinder() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Remove GPS from Dating App Photos | Tinder, Bumble Safety Tool";
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
        {/* Hero Section - Dating App Focused */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Remove GPS from <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">Dating App Photos</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Stay safe on Tinder, Bumble, Hinge. Remove location data from your photos before uploading — protect yourself from stalkers.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-300 font-medium">Anti-Stalking</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">100% Private</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-300 font-medium">No Upload</span>
            </div>
          </div>

          <Button 
            onClick={scrollToTool}
            size="lg"
            className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
          >
            Secure Your Photos Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>

        {/* Why Dating App Users Need This */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why This Matters for Dating App Safety
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Reason 1 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Hide Your Home Address</h3>
              <p className="text-muted-foreground text-sm">
                Photos taken at home contain GPS coordinates. Strangers can find your exact address from photo metadata. Remove it before sharing on dating apps.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <UserX className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Prevent Stalking</h3>
              <p className="text-muted-foreground text-sm">
                Dating apps attract both good and bad people. Don't give stalkers your home, work, or gym location through photo metadata.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Date on Your Terms</h3>
              <p className="text-muted-foreground text-sm">
                Meet people safely without revealing where you live, work, or spend time. Remove GPS metadata to control what you share.
              </p>
            </div>
          </div>
        </section>

        {/* Real Risk Warning */}
        <section className="mb-12">
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-3">
                  Real Risk: Dating App Photo Metadata
                </h3>
                <p className="text-red-800 dark:text-red-300 mb-4 text-sm">
                  <strong>True story:</strong> A dating app user posted a selfie taken at home. The photo's GPS metadata revealed their exact address. An obsessive match showed up uninvited at their door.
                </p>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  <strong>Don't let this happen to you.</strong> Remove GPS data from every photo before uploading to Tinder, Bumble, Hinge, or any dating platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="mb-12">
          <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 rounded-2xl p-1">
            <div className="bg-background rounded-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Remove GPS from Your Dating Photos
              </h2>
              <Dropzone />
            </div>
          </div>
        </section>

        {/* Dating App FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Dating App Safety FAQs
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Do dating apps remove GPS data automatically?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                <strong>No.</strong> Tinder, Bumble, and Hinge process images but don't guarantee complete GPS removal. Some metadata can slip through. Clean your photos yourself before uploading to be 100% safe.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Can someone find my address from a Tinder photo?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes, if GPS metadata is still in the file. Anyone can download your photo and extract coordinates using free tools. Remove GPS before uploading to prevent this.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Is this tool completely private?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes! This tool runs 100% in your browser. Your photos never leave your device. No server upload, no tracking, no storage. Perfect for sensitive dating photos.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Which dating apps should I use this for?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Use this for <strong>all</strong> dating apps: Tinder, Bumble, Hinge, OkCupid, Match, Plenty of Fish, Coffee Meets Bagel, and others. Better safe than sorry.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Date Safely, Not Sorry
            </h2>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              Remove GPS metadata from every photo before uploading to dating apps. Protect yourself from stalkers and unwanted visitors.
            </p>
            <Button 
              onClick={scrollToTool}
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-pink-600 hover:bg-gray-100"
            >
              Clean Your Photos Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
