
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sidebar-background text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <div className="font-bold text-xl text-white mb-4">
              <span className="text-electric">Body</span>Scan
            </div>
            <p className="mb-4">
              Transforming how businesses capture and utilize body measurements through AI-powered technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-electric" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-electric" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-electric" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-electric" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-electric">About Us</a></li>
              <li><a href="#" className="hover:text-electric">Careers</a></li>
              <li><a href="#" className="hover:text-electric">Press</a></li>
              <li><a href="#" className="hover:text-electric">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-electric">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-electric">Terms of Service</a></li>
              <li><a href="#" className="hover:text-electric">GDPR Compliance</a></li>
              <li><a href="#" className="hover:text-electric">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-sidebar-border text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} BodyScan AI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with cutting-edge AI technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
