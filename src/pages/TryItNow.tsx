
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BodyScanForm from "@/components/BodyScanForm";
import MeasurementResults from "@/components/MeasurementResults";
import { toast } from "@/components/ui/use-toast";
import PrivacyNotice from "@/components/PrivacyNotice";
import { calculateBodyMeasurements } from "@/utils/bodyMeasurementAI";

type ScanStatus = "input" | "processing" | "complete";

export default function TryItNow() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("input");
  const [measurements, setMeasurements] = useState<Record<string, number> | null>(null);
  
  const handleFormSubmit = async (formData: any) => {
    try {
      setScanStatus("processing");
      toast({
        title: "Processing Images",
        description: "Analyzing your photos to generate accurate measurements...",
      });
      
      // Use our AI measurement system to calculate real measurements
      const result = await calculateBodyMeasurements(
        formData.gender, 
        formData.height,
        formData.measurementSystem,
        formData.frontImage,
        formData.sideImage
      );
      
      if (result) {
        setMeasurements(result);
        setScanStatus("complete");
        toast({
          title: "Scan Complete",
          description: "Your body measurements have been calculated successfully.",
        });
      } else {
        // If measurement calculation failed, return to input state
        setScanStatus("input");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setScanStatus("input");
      toast({
        title: "Processing Failed",
        description: "We encountered an error while processing your images. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setScanStatus("input");
    setMeasurements(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              AI Body Measurement Tool
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Get accurate body measurements in seconds using our advanced AI technology
            </p>
            
            {scanStatus === "input" && (
              <BodyScanForm onSubmit={handleFormSubmit} />
            )}
            
            {scanStatus === "processing" && (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-electric/20 mx-auto mb-6 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-electric/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-electric"></div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Processing Your Scan</h2>
                <p className="text-gray-600">Our AI is analyzing your images to calculate accurate measurements...</p>
                <p className="text-gray-500 text-sm mt-4">This may take up to 30 seconds</p>
              </div>
            )}
            
            {scanStatus === "complete" && measurements && (
              <MeasurementResults measurements={measurements} onReset={resetForm} />
            )}
          </div>
        </div>
        
        <PrivacyNotice />
      </main>
      <Footer />
    </div>
  );
}
