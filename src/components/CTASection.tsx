
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const section = document.getElementById('cta-section');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section id="cta-section" className="section-padding bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`max-w-4xl mx-auto text-center ${
            isVisible ? 'fade-in-up' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform the Way You Size Up?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Join thousands of businesses revolutionizing their customer experience with our AI body scanning technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100 transition-transform hover:scale-105" 
              asChild
            >
              <Link to="/try-it-now">Try It Now</Link>
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
            >
              <span>Sign Up Free</span>
              <ChevronRight className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
