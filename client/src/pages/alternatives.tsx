import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import Footer from '@/components/footer';
import { useLanguage } from '@/hooks/use-language';
import { Shield, CheckCircle, X, Zap, Globe, DollarSign, Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Alternatives() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "GPS Metadata Remover Alternatives | Compare Best Tools";
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
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            GPS Metadata Remover <span className="text-primary">Alternatives</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Compare the best tools to remove GPS and metadata from photos. See why SecureGPS is the top choice.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-center font-semibold bg-primary/10">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      SecureGPS
                    </div>
                  </th>
                  <th className="p-4 text-center font-semibold">Photoshop</th>
                  <th className="p-4 text-center font-semibold">ExifTool</th>
                  <th className="p-4 text-center font-semibold">Online Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Price</td>
                  <td className="p-4 text-center bg-primary/5">
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      Free
                    </span>
                  </td>
                  <td className="p-4 text-center text-muted-foreground">$20+ /month</td>
                  <td className="p-4 text-center text-green-600 dark:text-green-400">Free</td>
                  <td className="p-4 text-center text-muted-foreground">Free - $10</td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">100% Offline</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">No Installation</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Easy to Use</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    <span className="text-sm">Complex</span>
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    <span className="text-sm">Command Line</span>
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Batch Processing</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    <span className="text-sm">Limited</span>
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Mobile Friendly</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    <span className="text-sm">Varies</span>
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">No Upload Required</td>
                  <td className="p-4 text-center bg-primary/5">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                </tr>

                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Speed</td>
                  <td className="p-4 text-center bg-primary/5">
                    <span className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                      <Zap className="w-4 h-4" />
                      Instant
                    </span>
                  </td>
                  <td className="p-4 text-center text-muted-foreground">Slow</td>
                  <td className="p-4 text-center text-green-600 dark:text-green-400">Fast</td>
                  <td className="p-4 text-center text-muted-foreground">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why SecureGPS Wins */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why SecureGPS is the Best Choice</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">100% Free vs Paid Software</h3>
                  <p className="text-sm text-muted-foreground">
                    Photoshop costs $20+/month. ExifTool requires technical knowledge. SecureGPS is completely free and works instantly in your browser.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">More Private than Online Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Other online tools require uploading your photos to their servers. SecureGPS processes everything offline in your browser. Zero upload.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Easier than Command Line Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    ExifTool requires command-line knowledge. SecureGPS has a simple drag-and-drop interface. Works on mobile and desktop without installation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Works Anywhere, Anytime</h3>
                  <p className="text-sm text-muted-foreground">
                    No installation, no signup, no download. Works on iPhone, Android, Windows, Mac, Linux. Even works offline as a PWA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-1">
            <div className="bg-background rounded-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Try SecureGPS Now — Completely Free
              </h2>
              <Dropzone />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              The Best GPS Remover, Completely Free
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              No installation, no upload, no payment. Remove GPS from photos instantly in your browser.
            </p>
            <Button 
              onClick={scrollToTool}
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Using SecureGPS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
