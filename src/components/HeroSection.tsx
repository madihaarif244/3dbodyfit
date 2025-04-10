
import { ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
      <div className="container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              Accurate Body Measurements in <span className="text-electric">Seconds</span> with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              No tape. No guesswork. Just a quick scan for perfectly tailored experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-electric hover:bg-electric-dark">
                Try It Now
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* 3D model visualization placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[9/16]">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-48 h-48 rounded-full bg-electric/10 animate-pulse-light flex items-center justify-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-electric/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-electric/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-electric"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">AI Body Scan in Progress</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
            </div>
            
            {/* Mobile scan overlay */}
            <div className="absolute -right-4 -bottom-4 w-32 h-64 bg-white rounded-2xl shadow-lg border border-gray-200 rotate-6 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-electric flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-electric/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" aria-label="Scroll down">
          <ArrowDown className="text-gray-700 h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
