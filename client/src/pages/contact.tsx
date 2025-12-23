import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { Mail, Github } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
          ← {t('footer.backToHome') || 'Back to Home'}
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed">
              Have questions, feedback, or need support? We'd love to hear from you. Choose your preferred method 
              of contact below.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-700 mb-3">
                  For general inquiries, bug reports, feature requests, or support questions, please email us at:
                </p>
                <a 
                  href="mailto:jowheemin@gmail.com" 
                  className="text-blue-600 hover:text-blue-700 font-medium underline text-lg"
                >
                  jowheemin@gmail.com
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  We typically respond within 24-48 hours on business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <Github className="w-6 h-6 text-gray-700 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GitHub Repository</h3>
                <p className="text-gray-700 mb-3">
                  For technical issues, feature requests, or to contribute to the project, visit our GitHub repository:
                </p>
                <a 
                  href="https://github.com/wheemin1/securegps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  github.com/wheemin1/securegps
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  Open an issue or submit a pull request. Contributions are welcome!
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What to Include in Your Message</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To help us assist you more effectively, please include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Clear subject line:</strong> Briefly describe your issue or question</li>
              <li><strong>Browser and OS:</strong> E.g., "Chrome 120 on Windows 11"</li>
              <li><strong>Image format:</strong> JPEG, PNG, WebP, HEIC, etc.</li>
              <li><strong>Steps to reproduce:</strong> What actions led to the issue?</li>
              <li><strong>Expected vs actual behavior:</strong> What should have happened vs what actually happened?</li>
              <li><strong>Screenshots:</strong> If applicable (for UI issues)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-700 leading-relaxed">
              Before reaching out, check our{" "}
              <Link href="/#faq" className="text-blue-600 hover:text-blue-700 underline">
                FAQ section
              </Link>{" "}
              on the homepage. Many common questions are answered there, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
              <li>Do you upload my files?</li>
              <li>What metadata gets removed?</li>
              <li>Which image formats are supported?</li>
              <li>How does browser-based processing work?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy Reminder</h2>
            <p className="text-gray-700 leading-relaxed">
              If you need to share sample photos for troubleshooting, please ensure they don't contain sensitive 
              information. Remember, SecureGPS processes all images client-side—your photos never reach our servers, 
              but email attachments are transmitted over email infrastructure.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Business Inquiries</h2>
            <p className="text-gray-700 leading-relaxed">
              For partnerships, media inquiries, or business opportunities, please email{" "}
              <a href="mailto:jowheemin@gmail.com" className="text-blue-600 hover:text-blue-700 underline">
                jowheemin@gmail.com
              </a>{" "}
              with "Business Inquiry" in the subject line.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
