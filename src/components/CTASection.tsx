
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="section-padding bg-electric">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform the Way You Size Up?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Join thousands of businesses revolutionizing their customer experience with our AI body scanning technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-electric hover:bg-gray-100">
              Request Demo
            </Button>
            <Button size="lg" className="bg-transparent border border-white hover:bg-white/10">
              <span>Sign Up Free</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
