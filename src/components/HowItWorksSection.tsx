
import { 
  User, 
  Upload, 
  Cpu, 
  Ruler, 
  ArrowRight,
  Box
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const steps = [
  {
    id: 1,
    icon: User,
    title: "Enter Gender & Height",
    description: "Helps calibrate the scan for precision",
    color: "bg-primary/20"
  },
  {
    id: 2,
    icon: Upload,
    title: "Upload or Capture Image",
    description: "Use your phone or webcam securely",
    color: "bg-primary/15"
  },
  {
    id: 3,
    icon: Cpu,
    title: "AI Processing",
    description: "Our model analyzes your image in seconds",
    color: "bg-primary/10"
  },
  {
    id: 4,
    icon: Ruler,
    title: "Get Measurements",
    description: "Receive detailed, accurate body data",
    color: "bg-primary/20"
  }
];

export default function HowItWorksSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute('data-step-id'));
          setVisibleItems(prev => [...prev, id]);
        }
      });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('[data-step-id]').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="section-padding bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our technology transforms smartphone images into precise body measurements in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative" 
              data-step-id={step.id}
              style={{ 
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div 
                className={cn(
                  "card-hover flex flex-col items-center p-4 bg-card rounded-xl shadow-md h-full",
                  visibleItems.includes(step.id) ? "fade-in-up" : "opacity-0"
                )}
              >
                <div className={cn("flex items-center justify-center w-14 h-14 rounded-full mb-3", step.color)}>
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 animate-pulse-blue">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Our AI ensures that your measurements are delivered with exceptional accuracy, making online shopping and custom clothing a breeze.
          </p>
        </div>
      </div>
    </section>
  );
}
