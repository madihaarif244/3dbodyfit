
import { 
  ShoppingBag, 
  Scissors, 
  Heart, 
  Monitor, 
  CheckCircle 
} from 'lucide-react';

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
  return (
    <section id="use-cases" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
          <p className="text-lg text-gray-700">
            Our technology powers innovation across industries, transforming how businesses engage with customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div key={index} className="card-hover bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start">
                <div className="bg-electric/10 p-3 rounded-full mr-4">
                  <useCase.icon className="w-6 h-6 text-electric" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
