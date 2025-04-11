
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
    <section id="features" className="section-padding bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Our Technology</h2>
          <p className="text-base text-muted-foreground">
            Powered by cutting-edge AI and computer vision to deliver unparalleled accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card-hover p-6 bg-card rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="bg-primary/5 p-3 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium mb-2 text-foreground">Why Trust Our Solution?</h3>
            <p className="text-muted-foreground">Our technology is built on trust, accuracy, and security.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-border">
                <indicator.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
