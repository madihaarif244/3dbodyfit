
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl text-black">
              <span className="text-electric">Body</span>Scan
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#how-it-works"
                className="text-gray-800 hover:text-electric px-3 py-2 text-sm font-medium animated-underline"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-gray-800 hover:text-electric px-3 py-2 text-sm font-medium animated-underline"
              >
                Features
              </a>
              <a
                href="#use-cases"
                className="text-gray-800 hover:text-electric px-3 py-2 text-sm font-medium animated-underline"
              >
                Use Cases
              </a>
              <a
                href="#results"
                className="text-gray-800 hover:text-electric px-3 py-2 text-sm font-medium animated-underline"
              >
                Results
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <Button variant="default" className="bg-electric hover:bg-electric-dark" asChild>
              <Link to="/try-it-now">Try It Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-electric focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-electric"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#features"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-electric"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-electric"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="#results"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-electric"
              onClick={() => setMobileMenuOpen(false)}
            >
              Results
            </a>
            <div className="pt-2">
              <Button 
                variant="default" 
                className="w-full bg-electric hover:bg-electric-dark"
                onClick={() => setMobileMenuOpen(false)}
                asChild
              >
                <Link to="/try-it-now">Try It Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
