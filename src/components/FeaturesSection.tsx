import { 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Box, 
  Eye, 
  HandMetal, 
  Globe, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: Box,
    title: "3D Modeling",
    description: "Convert 2D images to accurate 3D body models"
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Advanced algorithms for precision detection"
  },
  {
    icon: HandMetal,
    title: "AI Accuracy",
    description: "Machine learning for continuous improvement"
  },
  {
    icon: Smartphone,
    title: "Mobile Compatible",
    description: "Works seamlessly on any device"
  }
];

const trustIndicators = [
  {
    icon: Check,
    text: "99% Accuracy"
  },
  {
    icon: ShieldCheck,
    text: "GDPR Compliant"
  },
  {
    icon: Smartphone,
    text: "Mobile First"
  },
  {
    icon: Globe,
    text: "Global Availability"
  },
  {
    icon: Zap,
    text: "Real-time Results"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
          <p className="text-lg text-gray-700">
            Powered by cutting-edge AI and computer vision to deliver unparalleled accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card-hover p-6 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-electric/10 p-3 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-electric" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Why Trust Our Solution?</h3>
            <p className="text-gray-700">Our technology is built on trust, accuracy, and security.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <indicator.icon className="w-5 h-5 text-electric" />
                <span className="text-sm font-medium">{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
