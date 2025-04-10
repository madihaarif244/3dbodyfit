
import { 
  ShoppingBag, 
  Scissors, 
  Heart, 
  Monitor, 
  CheckCircle 
} from 'lucide-react';
import { useEffect, useState } from 'react';

const useCases = [
  {
    icon: ShoppingBag,
    title: "Fashion Retail",
    description: "Enable precise size recommendations for online shoppers",
    benefits: ["Reduce returns by 40%", "Increase customer satisfaction", "Boost sales conversion"]
  },
  {
    icon: Scissors,
    title: "Online Tailoring",
    description: "Create custom-fitted clothing without in-person measurements",
    benefits: ["Perfect fit guarantee", "Streamlined ordering process", "Global customer reach"]
  },
  {
    icon: Heart,
    title: "Fitness & Wellness",
    description: "Track body changes and fitness progress accurately",
    benefits: ["Monitor progress visually", "Set realistic goals", "Enhance motivation"]
  },
  {
    icon: Monitor,
    title: "Virtual Fitting",
    description: "Try clothes virtually before purchasing",
    benefits: ["See how garments fit", "Mix and match outfits", "Shop confidently online"]
  }
];

export default function UseCasesSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute('data-case-id'));
          setVisibleItems(prev => [...prev, id]);
        }
      });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('[data-case-id]').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="use-cases" className="section-padding bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Use Cases</h2>
          <p className="text-lg text-muted-foreground">
            Our technology powers innovation across industries, transforming how businesses engage with customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={index} 
              data-case-id={index}
              className={`${
                visibleItems.includes(index) ? (index % 2 === 0 ? 'fade-in-left' : 'fade-in-right') : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="card-hover bg-card p-8 rounded-xl shadow-md border border-border">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-foreground">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4">{useCase.description}</p>
                    
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span className="text-sm text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
