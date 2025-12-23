import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
          ← {t('footer.backToHome') || 'Back to Home'}
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Privacy Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              At SecureGPS, privacy is not just a feature—it's our foundation. We've designed our service to ensure 
              your photos and personal data remain completely private and secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">100% Client-Side Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Your photos never leave your device.</strong> All metadata removal happens locally in your 
              browser using JavaScript and Web Workers. We do not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Upload your photos to any server</li>
              <li>Store your images in any database</li>
              <li>Transmit your files over the internet</li>
              <li>Have access to view or analyze your photos</li>
              <li>Keep any copies of your original or processed images</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data We Do NOT Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS does not collect, store, or process any of the following:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Photo files or image content</li>
              <li>GPS coordinates or location data from your photos</li>
              <li>EXIF, XMP, or IPTC metadata from your images</li>
              <li>Device information or camera details</li>
              <li>Personal information or user accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Google AdSense and Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              This website uses Google AdSense to display advertisements. Google may use cookies and similar 
              technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Serve ads based on your prior visits to this or other websites</li>
              <li>Measure ad effectiveness and provide aggregated reporting</li>
              <li>Prevent fraud and improve ad security</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:text-blue-700 underline">
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Analytics and Usage Data</h2>
            <p className="text-gray-700 leading-relaxed">
              We may collect anonymized usage statistics (page views, browser type, general location at country level) 
              to improve our service. This data cannot be used to identify individual users and does not include any 
              information about your photos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS is hosted on Netlify. While we don't upload your photos, Netlify may collect standard web 
              server logs (IP addresses, browser types) for security and performance monitoring. These logs do not 
              contain any photo data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              Since we don't collect or store your personal data or photos, there is no data to request, modify, or 
              delete. You have complete control over your photos at all times—they remain on your device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p className="text-gray-700 leading-relaxed">
              Our client-side architecture is the ultimate security measure. Your photos are processed entirely in your 
              browser's secure sandbox environment, protected by modern browser security features. No network transmission 
              means no risk of interception.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS does not knowingly collect any information from children under 13. Our service can be used by 
              anyone without providing personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. The "Last Updated" date at the bottom will reflect any 
              changes. Continued use of SecureGPS after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:jowheemin@gmail.com" className="text-blue-600 hover:text-blue-700 underline">
                jowheemin@gmail.com
              </a>
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Last Updated: December 23, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
