
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
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/d68b6180-6947-417b-83c0-7699542cbfc7.png" 
                alt="3DBodyFit" 
                className="h-8 w-8" 
              />
              <span className="font-bold text-xl">
                <span className="text-primary">3D</span>Body<span className="text-primary">Fit</span>
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-foreground hover:text-primary font-medium"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-foreground hover:text-primary font-medium"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="text-foreground hover:text-primary font-medium"
            >
              Use Cases
            </a>
            <a
              href="#results"
              className="text-foreground hover:text-primary font-medium"
            >
              Results
            </a>
            
            <Button variant="default" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/try-it-now">Try It Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#features"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="#results"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Results
            </a>
            <div className="pt-2">
              <Button 
                variant="default" 
                className="w-full bg-primary hover:bg-primary/90"
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
