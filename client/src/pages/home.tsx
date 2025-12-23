import { LanguageSelector } from '@/components/language-selector';
import { Dropzone } from '@/components/dropzone';
import { AdvancedPanel } from '@/components/advanced-panel';
import { MetadataModal } from '@/components/metadata-modal';
import { FAQSection } from '@/components/faq-section';
import Footer from '@/components/footer';
import { useLanguage } from '@/hooks/use-language';
import { Shield, Zap, Monitor, Lock, AlertTriangle, Info, Wifi, WifiOff, ShieldCheck, MapPin, Camera, Eye, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Home() {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);
  const [showDisclaimers, setShowDisclaimers] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide button after installation
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
                  {t('app.title')}
                </h1>
                {isPWA && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {isOnline ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" />
                        <span>Works offline</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-orange-500" />
                        <span>Offline mode</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {showInstallButton && !isPWA && (
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  variant="outline"
                  className="hidden md:flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App</span>
                </Button>
              )}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-8 md:py-12 max-w-lg pb-32 md:pb-12">
        {/* Hero Section - Toss Style (Ultra Clean) */}
        <section className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
            Make Your Photos Anonymous
          </h1>
          
          <p className="text-base text-gray-500 dark:text-gray-400 mb-6">
            Remove GPS & metadata. 100% on-device.
          </p>
          
          {/* Trust Badges - Toss Style (Inline, Minimal) */}
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Secure</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Fast</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-blue-600" />
              <span>Offline</span>
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
            
            {/* Simplified Disclaimers - Dialog Trigger */}
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowDisclaimers(true)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors underline underline-offset-4"
              >
                <Info className="w-3 h-3" />
                Safety & Limitations
              </button>
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
        
        {/* Educational Content Section */}
        <section id="why-remove-metadata" className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-3xl font-bold mb-6">Why Remove GPS and Metadata from Photos?</h2>
            
            <div className="prose prose-gray max-w-none space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  The Hidden Privacy Risk in Your Photos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Every time you take a photo with your smartphone or digital camera, the device automatically embeds hidden metadata—including GPS coordinates that reveal your exact location. This invisible data, known as EXIF (Exchangeable Image File Format), can expose where you live, work, travel, and spend time. When you share photos on social media, job applications, dating apps, or online marketplaces, you may unintentionally broadcast your home address, workplace location, or daily routines to strangers.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  According to privacy researchers, over 70% of smartphone users are unaware that their photos contain GPS coordinates. This metadata can be extracted in seconds using free online tools or command-line programs. Stalkers, identity thieves, burglars, and malicious actors routinely scrape public photos from social media platforms to harvest location data, creating serious safety and security risks for individuals and families.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  What Metadata Do Photos Actually Contain?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Digital photos store far more than just pixels. Common metadata fields include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>GPS Coordinates:</strong> Latitude and longitude showing exactly where the photo was taken, accurate to within meters</li>
                  <li><strong>Date and Time:</strong> Precise timestamp of when the photo was captured, including timezone</li>
                  <li><strong>Device Information:</strong> Camera model, smartphone brand, serial numbers</li>
                  <li><strong>Camera Settings:</strong> Aperture, shutter speed, ISO, focal length, flash usage</li>
                  <li><strong>Software Details:</strong> Photo editing apps used, file modification history</li>
                  <li><strong>Copyright and Author:</strong> Names, emails, or usernames embedded by cameras or editing software</li>
                  <li><strong>Embedded Thumbnails:</strong> Small preview images that may show unedited versions of cropped photos</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  For iPhones and Android devices, GPS data is enabled by default in the camera app. Unless you've specifically disabled location services for your camera, every photo you take includes a digital breadcrumb trail of your movements.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Eye className="w-6 h-6 text-orange-600" />
                  Real-World Privacy Threats
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The consequences of exposed photo metadata are not theoretical—they're happening every day:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Home Address Exposure:</strong> Posting a photo of your new car, pet, or home improvement project can reveal your residential address to anyone who views it</li>
                    <li><strong>Workplace Stalking:</strong> Photos taken at your office or during lunch breaks can expose your employer's location, putting you at risk for workplace harassment</li>
                    <li><strong>Travel Security:</strong> Vacation photos shared while you're away tell burglars your home is empty and show when you'll return</li>
                    <li><strong>Dating App Safety:</strong> Profile photos with embedded GPS coordinates can reveal where you live or frequent, compromising personal safety</li>
                    <li><strong>Job Application Privacy:</strong> Resumes with photos containing metadata can leak personal information to potential employers before you consent to share it</li>
                    <li><strong>Child Safety:</strong> Family photos shared on social media can expose school locations, daily routines, and home addresses—critical information for predators</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  In documented cases, journalists, activists, and abuse survivors have been tracked down through photo metadata. Even celebrities and politicians have accidentally revealed private locations by sharing photos with GPS data intact.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  Why SecureGPS Is the Safest Solution
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Unlike other metadata removal tools that require uploading your photos to third-party servers, SecureGPS processes everything directly in your web browser. Here's why this matters:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>100% Client-Side Processing:</strong> Your photos never leave your device. All metadata removal happens locally using JavaScript and Web Workers—no server uploads, no cloud storage, no third-party access</li>
                    <li><strong>Zero Data Collection:</strong> We don't log your IP address, track your activity, or store any information about you or your photos. There are no user accounts, no analytics on your images</li>
                    <li><strong>Works Offline:</strong> Once loaded, SecureGPS can process photos even without an internet connection, perfect for sensitive environments</li>
                    <li><strong>Instant Processing:</strong> Batch process multiple photos in seconds without waiting for uploads or downloads</li>
                    <li><strong>Cross-Platform:</strong> Works on iPhone, Android, Windows, Mac, Linux, and Chromebook—anywhere you have a modern web browser</li>
                    <li><strong>No Installation Required:</strong> No apps to download, no software to trust, no permissions to grant. Just visit the website and start cleaning photos immediately</li>
                    <li><strong>Open Source Transparency:</strong> Our code is available on GitHub for security researchers and privacy advocates to audit</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Most online tools claim to delete metadata, but they require uploading your private photos to their servers first. Once uploaded, you have no control over whether those servers log your images, metadata, or IP addresses. Some services even retain copies for "quality assurance" or "training purposes." With SecureGPS, your photos stay on your device—the way privacy should work.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Best Practices for Photo Privacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  For maximum protection, follow these privacy guidelines:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Remove metadata before sharing:</strong> Use SecureGPS on every photo before posting to social media, dating apps, job sites, or online marketplaces</li>
                  <li><strong>Disable camera GPS:</strong> Turn off location services for your camera app in iPhone Settings → Privacy → Location Services → Camera or Android Settings → Apps → Camera → Permissions</li>
                  <li><strong>Check existing photos:</strong> Your old photo library may contain thousands of images with embedded GPS data. Batch process them with SecureGPS before archiving or sharing</li>
                  <li><strong>Beware of cropped images:</strong> Simply cropping a photo doesn't remove metadata—the GPS coordinates and camera info remain in the file</li>
                  <li><strong>Educate family members:</strong> Teach children and elderly relatives about metadata risks, especially when sharing photos of home, school, or daily routines</li>
                  <li><strong>Verify removal:</strong> After processing, use SecureGPS's built-in metadata viewer to confirm all sensitive data has been stripped</li>
                </ol>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 my-6">
                <h3 className="text-xl font-semibold mb-3">Take Action Now</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Don't wait until your privacy is compromised. Every photo you share without removing metadata is a potential security risk. SecureGPS makes it fast, free, and easy to protect yourself and your family.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Scroll up to start removing GPS coordinates and metadata from your photos in seconds—completely free, no registration required, 100% private.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ad Banner after Educational Content */}
        <section className="bg-muted border border-border rounded-lg py-8 mb-8">
          <div className="container mx-auto px-4 text-center">
            <div className="text-muted-foreground">
              <div className="text-sm font-medium mb-2">Advertisement Space</div>
              <div className="text-xs opacity-70">728x90 or responsive banner (post-content placement)</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Disclaimers Dialog */}
      <Dialog open={showDisclaimers} onOpenChange={setShowDisclaimers}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Safety Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  {t('disclaimers.important.title')}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {t('disclaimers.important.content')}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  {t('disclaimers.content.title')}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('disclaimers.content.content')}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
