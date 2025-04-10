
import { Download, Mail, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MeasurementResultsProps {
  measurements: Record<string, number>;
  onReset: () => void;
}

const MEASUREMENT_DISPLAY_MAP: Record<string, string> = {
  chest: "Chest",
  waist: "Waist",
  hips: "Hips",
  inseam: "Inseam",
  shoulder: "Shoulder Width",
  sleeve: "Sleeve Length",
  neck: "Neck",
  thigh: "Thigh"
};

export default function MeasurementResults({ measurements, onReset }: MeasurementResultsProps) {
  const handleDownload = () => {
    // Create a downloadable text file with measurements
    const text = Object.entries(measurements)
      .map(([key, value]) => `${MEASUREMENT_DISPLAY_MAP[key] || key}: ${value.toFixed(1)} cm`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'body-measurements.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Measurements Downloaded",
      description: "Your measurements have been saved as a text file.",
    });
  };
  
  const handleEmailResults = () => {
    // In a real app, this would connect to an API to send email
    toast({
      title: "Email Feature",
      description: "In a production app, this would send measurements to your email.",
    });
  };
  
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="bg-electric p-6 text-white">
        <h2 className="text-2xl font-bold">Your Body Measurements</h2>
        <p className="opacity-90">Generated with AI precision</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Measurements</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info size={18} className="text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      These measurements are calculated using advanced computer vision algorithms that
                      analyze your uploaded images together with your provided height.
                      Accuracy may vary based on image quality and positioning.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              {Object.entries(measurements).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-gray-700">{MEASUREMENT_DISPLAY_MAP[key] || key}</span>
                  <span className="font-medium">{value.toFixed(1)} cm</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download size={16} />
              Download Results
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleEmailResults}
            >
              <Mail size={16} />
              Email Results
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="text-center">
            <div className="mx-auto w-32 h-64 bg-gray-200 rounded-full mb-4 relative overflow-hidden">
              {/* This would be a 3D avatar in a real implementation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>3D Avatar</span>
                <span className="text-xs mt-1">Coming soon</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Based on your measurements, we would generate a personalized 3D avatar in our full version
            </p>
            <div className="mt-4 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center gap-2">
              <Info size={14} />
              <span>Our AI measurement technology integrates advanced anthropometric models with computer vision to provide accurate estimations.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t bg-gray-50 flex justify-center">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Start a New Scan
        </Button>
      </div>
    </div>
  );
}
