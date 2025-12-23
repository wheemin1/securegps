import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-lg mb-3">SecureGPS</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Eliminate GPS tracking risks from photos instantly. 100% offline, client-side processing.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-blue-600" />
              <span>Built by Former EOD Expert</span>
            </div>
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
            © {new Date().getFullYear()} SecureGPS. 100% offline processing in your browser. Zero uploads, zero tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
