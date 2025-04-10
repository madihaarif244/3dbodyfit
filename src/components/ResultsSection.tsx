
import { Lock, Shield, BadgeCheck } from 'lucide-react';

const testimonials = [
  {
    quote: "This technology has reduced our return rate by 38% in just three months.",
    author: "Sarah J.",
    role: "E-commerce Director",
    company: "Fashion Retailer"
  },
  {
    quote: "Our customers love the virtual try-on experience. It's revolutionized our online store.",
    author: "Michael T.",
    role: "CEO",
    company: "Custom Apparel Brand"
  },
  {
    quote: "The accuracy is remarkable. Our tailors can work confidently with these measurements.",
    author: "Elena R.",
    role: "Head of Production",
    company: "Bespoke Tailoring"
  },
];

export default function ResultsSection() {
  return (
    <section id="results" className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Real Results</h2>
          <p className="text-lg text-gray-200">
            See how our technology transforms businesses and delights customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Sample Outputs</h3>
              <p className="text-gray-700 mb-6">
                Our AI creates accurate body models while preserving privacy.
              </p>
              
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-electric mr-1" />
                  <span className="text-sm">Privacy Protected</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-electric mr-1" />
                  <span className="text-sm">Secure Processing</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap">
              <div className="w-1/2 aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center p-4">
                <div className="w-32 h-32 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border border-gray-200">
                  <div className="w-20 h-32 bg-gray-400/30 rounded-xl"></div>
                </div>
              </div>
              <div className="w-1/2 aspect-square bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center p-4">
                <div className="rounded-md bg-white/40 backdrop-blur-sm p-2 w-36">
                  <div className="h-4 bg-gray-600/20 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600/20 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-600/20 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600/20 rounded mb-2 w-4/5"></div>
                  <div className="h-3 bg-gray-600/20 rounded w-2/3"></div>
                </div>
              </div>
              <div className="w-1/2 aspect-square bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center p-4">
                <div className="w-32 h-48 bg-white/40 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center space-y-1 border border-gray-200">
                  <div className="w-2/3 h-2 bg-gray-600/30 rounded"></div>
                  <div className="w-4/5 h-2 bg-gray-600/30 rounded"></div>
                  <div className="w-1/2 h-2 bg-gray-600/30 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-600/30 rounded"></div>
                </div>
              </div>
              <div className="w-1/2 aspect-square bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center p-4">
                <div className="w-36 h-36 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200">
                  <div className="w-24 h-24 border-4 border-dashed border-gray-400/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-electric/5 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Trusted By Industry Leaders</h3>
                <BadgeCheck className="w-8 h-8 text-electric" />
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-gray-200">
                  <BadgeCheck className="w-5 h-5 text-electric mr-2" />
                  <span>50+ Retail Partners Worldwide</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <BadgeCheck className="w-5 h-5 text-electric mr-2" />
                  <span>5+ Million Successful Scans</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <BadgeCheck className="w-5 h-5 text-electric mr-2" />
                  <span>99.2% Measurement Accuracy</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
