import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
          ← {t('footer.backToHome') || 'Back to Home'}
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using SecureGPS ("the Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS is a free, client-side web application that removes GPS coordinates, EXIF data, and other 
              metadata from digital photos. All processing occurs locally in your web browser—no files are uploaded 
              to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You are granted a non-exclusive, non-transferable license to use SecureGPS for personal or commercial 
              purposes, subject to the following restrictions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You may not reverse engineer or attempt to extract the source code</li>
              <li>You may not redistribute or resell the Service</li>
              <li>You may not use the Service for illegal activities</li>
              <li>You may not attempt to bypass or disable any security features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When using SecureGPS, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Only process photos that you own or have permission to modify</li>
              <li>Verify the results of metadata removal meet your requirements</li>
              <li>Keep your original photos backed up before processing</li>
              <li>Use a modern, updated web browser for optimal security</li>
              <li>Comply with all applicable laws regarding photo privacy and metadata</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">No Warranty</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS is provided "as is" without warranties of any kind, express or implied. We do not guarantee 
              that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The Service will be uninterrupted or error-free</li>
              <li>All metadata will be removed in every case</li>
              <li>The Service will meet your specific requirements</li>
              <li>Defects will be corrected</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              While we strive for accuracy, you should verify results for critical use cases. Different photo formats 
              and browser capabilities may affect processing outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, SecureGPS and its operators shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
              incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
              from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to your device or data</li>
              <li>Any bugs, viruses, or harmful code transmitted through the Service</li>
              <li>Any errors or omissions in the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy and Data Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of SecureGPS is subject to our Privacy Policy. By using the Service, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Photo processing occurs entirely in your browser</li>
              <li>No image files are transmitted to our servers</li>
              <li>You retain full ownership and control of your photos</li>
              <li>Advertisements may be displayed via Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its source code, design, and branding, is owned by SecureGPS and protected by 
              international copyright, trademark, and other intellectual property laws. The SecureGPS name and logo 
              are trademarks and may not be used without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              SecureGPS may contain links to third-party websites or services (such as Google AdSense) that are not 
              owned or controlled by us. We have no control over and assume no responsibility for the content, privacy 
              policies, or practices of any third-party sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications to Service</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We shall 
              not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may revise these Terms at any time. The most current version will always be posted on this page with 
              the "Last Updated" date. Continued use of the Service after changes constitutes acceptance of the revised 
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              the Service is operated, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at:{" "}
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
