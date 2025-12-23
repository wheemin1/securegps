import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-lg mb-3">SecureGPS</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Remove GPS and metadata from photos instantly. 100% private, client-side processing.
            </p>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-foreground hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-foreground hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/wheemin1/securegps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-blue-600 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SecureGPS. All processing happens locally in your browser. No uploads, no tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
