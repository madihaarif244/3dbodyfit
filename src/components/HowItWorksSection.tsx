
import { 
  User, 
  Upload, 
  Cpu, 
  Ruler, 
  ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 1,
    icon: User,
    title: "Enter Gender & Height",
    description: "Helps calibrate the scan for precision",
    color: "bg-electric/20"
  },
  {
    id: 2,
    icon: Upload,
    title: "Upload or Capture Image",
    description: "Use your phone or webcam securely",
    color: "bg-electric/15"
  },
  {
    id: 3,
    icon: Cpu,
    title: "AI Processing",
    description: "Our model analyzes your image in seconds",
    color: "bg-electric/10"
  },
  {
    id: 4,
    icon: Ruler,
    title: "Get Measurements",
    description: "Receive detailed, accurate body data",
    color: "bg-electric/20"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our technology transforms smartphone images into precise body measurements in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="card-hover flex flex-col items-center p-6 bg-card rounded-xl shadow-md h-full">
                <div className={cn("flex items-center justify-center w-16 h-16 rounded-full mb-4", step.color)}>
                  <step.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-electric" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI ensures that your measurements are delivered with exceptional accuracy, making online shopping and custom clothing a breeze.
          </p>
        </div>
      </div>
    </section>
  );
}
