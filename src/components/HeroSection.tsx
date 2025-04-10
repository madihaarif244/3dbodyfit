
import { ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12 flex flex-col items-center text-center">
        <div className="max-w-xl">
          <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 fade-in-left" style={{ animationDelay: '200ms' }}>
            Accurate Body Measurements in <span className="text-primary">Seconds</span> with AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 fade-in-left" style={{ animationDelay: '400ms' }}>
            No tape. No guesswork. Just a quick scan for perfectly tailored experiences.
          </p>
          <div className="flex flex-row gap-4 justify-center fade-in-left" style={{ animationDelay: '600ms' }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105" asChild>
              <Link to="/try-it-now">Try It Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-transform hover:scale-105" asChild>
              <a href="#how-it-works">
                See How It Works
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" aria-label="Scroll down" className="text-foreground hover:text-primary transition-colors">
          <ArrowDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
