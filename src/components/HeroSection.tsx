
import { ArrowDown, Cube } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Floating3DModel from './Floating3DModel';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
      <div className="container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center justify-center lg:justify-start mb-6 fade-in-left">
              <div className="bg-primary rounded-md p-2 mr-3">
                <Cube className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary">3D</span>Body<span className="text-primary">Fit</span>
              </span>
            </div>
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 fade-in-left" style={{ animationDelay: '200ms' }}>
              Accurate Body Measurements in <span className="text-primary">Seconds</span> with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 fade-in-left" style={{ animationDelay: '400ms' }}>
              No tape. No guesswork. Just a quick scan for perfectly tailored experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-left" style={{ animationDelay: '600ms' }}>
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

        <div className="lg:w-1/2 flex justify-center lg:justify-end fade-in-right" style={{ animationDelay: '300ms' }}>
          <div className="relative w-full max-w-md">
            {/* 3D model visualization */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-background to-secondary aspect-[9/16] border border-border">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Floating3DModel />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
            </div>
            
            {/* Mobile scan overlay */}
            <div className="absolute -right-4 -bottom-4 w-32 h-64 bg-card rounded-2xl shadow-lg border border-border rotate-6 overflow-hidden animate-float">
              <div className="h-full w-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
              </div>
            </div>
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
