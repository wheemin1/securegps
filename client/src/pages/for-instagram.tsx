import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import Footer from '@/components/footer';
import { useLanguage } from '@/hooks/use-language';
import { Shield, Instagram, MapPin, Eye, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ForInstagram() {
  const { t } = useLanguage();

  useEffect(() => {
    // Update page title
    document.title = "Remove GPS from Instagram Photos | Photo Privacy Tool for Influencers";
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
        {/* Hero Section - Instagram Focused */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-6">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Remove GPS from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Instagram Photos</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Protect your privacy before posting on Instagram. Remove location data from photos instantly — 100% free & offline.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-300 font-medium">100% Private</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">No Server Upload</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-800 dark:text-purple-300 font-medium">Influencer Safe</span>
            </div>
          </div>

          <Button 
            onClick={scrollToTool}
            size="lg"
            className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Clean Your Photos Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>

        {/* Why Instagram Users Need This */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Instagram Creators & Influencers Use This
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Reason 1 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Hide Your Home Location</h3>
              <p className="text-muted-foreground text-sm">
                Photos taken at home often contain GPS coordinates. Protect your privacy by removing location data before posting to Instagram.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Prevent Stalking</h3>
              <p className="text-muted-foreground text-sm">
                Influencers and public figures face unique risks. Remove GPS data to prevent followers from tracking your whereabouts through metadata.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Safe Content Creation</h3>
              <p className="text-muted-foreground text-sm">
                Create content freely without revealing shooting locations. Perfect for travel bloggers, lifestyle influencers, and privacy-conscious creators.
              </p>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-1">
            <div className="bg-background rounded-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Remove GPS from Your Instagram Photos
              </h2>
              <Dropzone />
            </div>
          </div>
        </section>

        {/* Instagram-Specific FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Instagram Privacy FAQs
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Does Instagram automatically remove GPS data?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                No. Instagram strips <strong>some</strong> EXIF data but NOT all GPS data. Some metadata can still leak through. To be 100% safe, remove GPS before uploading.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Can followers see my location from Instagram photos?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                If you add a location tag manually, yes. But GPS metadata (hidden coordinates in the file) can also expose your location even without a tag. Use this tool to remove all location data.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Is this safe for influencers with thousands of followers?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes! This tool works 100% offline in your browser. Your photos never leave your device. Perfect for influencers, celebrities, and anyone who needs guaranteed privacy.
              </p>
            </details>

            <details className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Does this work with Instagram Stories and Reels?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <p className="text-muted-foreground mt-4 text-sm">
                Yes! Clean your photos/videos before uploading to Stories or Reels. Works with JPEG, PNG, and WebP formats.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Post Safely on Instagram
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of influencers and creators who protect their privacy before posting.
            </p>
            <Button 
              onClick={scrollToTool}
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-purple-600 hover:bg-gray-100"
            >
              Start Removing GPS Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
