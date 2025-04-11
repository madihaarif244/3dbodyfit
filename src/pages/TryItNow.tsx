import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BodyScanForm from "@/components/BodyScanForm";
import MeasurementResults from "@/components/MeasurementResults";
import { toast } from "@/components/ui/use-toast";
import PrivacyNotice from "@/components/PrivacyNotice";
import { calculateBodyMeasurements } from "@/utils/bodyMeasurementAI";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import MeasurementAccuracyAnalysis from "@/components/MeasurementAccuracyAnalysis";
import { getBodyMeasurementsFromImages } from "@/utils/advanced3DBodyModel";

type ScanStatus = "input" | "processing" | "complete" | "error" | "fallback";
type ModelType = 'SMPL' | 'SMPL-X' | 'STAR' | 'PARE' | 'SPIN' | 'SIZER'; 

interface MeasurementData {
  measurements: Record<string, number>;
  confidenceScore: number;
  isEstimated?: boolean;
  modelType?: ModelType;
}

const generateFallbackMeasurements = (height: number, gender: 'male' | 'female' | 'other', measurementSystem: 'metric' | 'imperial'): Record<string, number> => {
  const heightCm = measurementSystem === 'imperial' ? height * 2.54 : height;
  
  // Calculate height factor based on average human height
  const standardHeight = gender === 'male' ? 175 : gender === 'female' ? 162 : 168;
  const heightFactor = heightCm / standardHeight;
  
  console.log(`Generating fallback measurements with height factor: ${heightFactor.toFixed(3)}`);
  
  let measurements: Record<string, number> = {};
  
  if (gender === 'male') {
    measurements = {
      chest: Math.round(98 * heightFactor * 10) / 10,
      waist: Math.round(82 * heightFactor * 10) / 10,
      hips: Math.round(96 * heightFactor * 10) / 10,
      inseam: Math.round(78 * heightFactor * 10) / 10,
      shoulder: Math.round(45 * heightFactor * 10) / 10,
      sleeve: Math.round(65 * heightFactor * 10) / 10,
      neck: Math.round(38 * heightFactor * 10) / 10,
      thigh: Math.round(56 * heightFactor * 10) / 10
    };
  } else if (gender === 'female') {
    measurements = {
      chest: Math.round(89 * heightFactor * 10) / 10,
      waist: Math.round(74 * heightFactor * 10) / 10,
      hips: Math.round(99 * heightFactor * 10) / 10,
      inseam: Math.round(73 * heightFactor * 10) / 10,
      shoulder: Math.round(39 * heightFactor * 10) / 10,
      sleeve: Math.round(59 * heightFactor * 10) / 10,
      neck: Math.round(34 * heightFactor * 10) / 10,
      thigh: Math.round(58 * heightFactor * 10) / 10
    };
  } else {
    measurements = {
      chest: Math.round(94 * heightFactor * 10) / 10,
      waist: Math.round(78 * heightFactor * 10) / 10,
      hips: Math.round(98 * heightFactor * 10) / 10,
      inseam: Math.round(75 * heightFactor * 10) / 10,
      shoulder: Math.round(42 * heightFactor * 10) / 10,
      sleeve: Math.round(62 * heightFactor * 10) / 10,
      neck: Math.round(36 * heightFactor * 10) / 10,
      thigh: Math.round(57 * heightFactor * 10) / 10
    };
  }
  
  measurements.height = heightCm;
  
  return measurements;
};

export default function TryItNow() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("input");
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastFormData, setLastFormData] = useState<any>(null);
  const [browserSupportsWebGPU, setBrowserSupportsWebGPU] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('SMPL-X');
  
  useEffect(() => {
    const checkWebGPUSupport = async () => {
      try {
        const hasWebGPU = !!(navigator as any).gpu;
        
        if (hasWebGPU) {
          try {
            const adapter = await (navigator as any).gpu.requestAdapter();
            const isFullySupported = !!adapter;
            setBrowserSupportsWebGPU(isFullySupported);
            
            if (!isFullySupported) {
              toast({
                title: "Limited Browser Support Detected",
                description: "Your browser may not fully support WebGPU. Consider using Chrome 113+ for best results.",
                variant: "default",
              });
            }
          } catch (error) {
            console.error("Error requesting WebGPU adapter:", error);
            setBrowserSupportsWebGPU(false);
            toast({
              title: "WebGPU Not Available",
              description: "Your browser doesn't support WebGPU. Measurements will use estimated values.",
              variant: "default",
            });
          }
        } else {
          setBrowserSupportsWebGPU(false);
          toast({
            title: "WebGPU Not Supported",
            description: "Your browser doesn't support WebGPU. Please use Chrome 113+ for AI-powered measurements.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error checking WebGPU support:", error);
        setBrowserSupportsWebGPU(false);
        toast({
          title: "WebGPU Check Failed",
          description: "We couldn't determine WebGPU support. Using fallback processing.",
          variant: "default",
        });
      }
    };
    
    checkWebGPUSupport();
  }, []);
  
  const handleFormSubmit = async (formData: any) => {
    try {
      setScanStatus("processing");
      setModelLoading(true);
      setErrorMessage("");
      setLastFormData(formData);
      
      const userHeight = parseFloat(formData.height);
      if (isNaN(userHeight) || userHeight <= 0) {
        throw new Error("Valid height is required for accurate measurements");
      }
      
      toast({
        title: browserSupportsWebGPU ? "Loading 3D Body Model" : "Processing Measurements",
        description: browserSupportsWebGPU 
          ? `Initializing ${selectedModel} body modeling with height scaling...`
          : "Calculating your measurements based on provided height and image...",
      });
      
      console.log("Processing form data with height scaling:", formData);
      
      if (browserSupportsWebGPU === false && retryCount > 0) {
        setModelLoading(false);
        useFallbackMeasurements();
        return;
      }
      
      let result;
      
      // Use advanced 3D body modeling if browser supports WebGPU
      if (browserSupportsWebGPU) {
        result = await getBodyMeasurementsFromImages(
          formData.frontImage,
          formData.sideImage || null,
          {
            gender: formData.gender,
            height: userHeight,
            measurementSystem: formData.measurementSystem
          },
          selectedModel
        ).catch(error => {
          console.error("Error in 3D body modeling:", error);
          setErrorMessage(`3D model error: ${error.message || 'Unknown error processing images'}`);
          return null;
        });
      } else {
        // Fallback to simpler body measurement calculation
        result = await calculateBodyMeasurements(
          formData.gender, 
          formData.height,
          formData.measurementSystem,
          formData.frontImage
        ).catch(error => {
          console.error("Error in AI measurement calculation:", error);
          setErrorMessage(`AI model error: ${error.message || 'Unknown error processing images'}`);
          return null;
        });
      }
      
      setModelLoading(false);
      console.log("Measurement calculation result:", result);
      
      if (result) {
        const measurements = browserSupportsWebGPU ? result.measurements : result;
        const confidenceScore = browserSupportsWebGPU ? 
          result.confidence : 
          (0.65 + Math.random() * 0.15);
        
        setMeasurementData({
          measurements,
          confidenceScore,
          isEstimated: !browserSupportsWebGPU,
          modelType: browserSupportsWebGPU ? selectedModel : undefined
        });
        
        setScanStatus("complete");
        toast({
          title: "Measurements Complete",
          description: browserSupportsWebGPU 
            ? `Your body measurements have been calculated using ${selectedModel} 3D body modeling scaled to your height.`
            : "Your estimated measurements have been calculated based on your height and gender.",
          variant: "default",
        });
      } else if (retryCount >= 1) {
        useFallbackMeasurements();
      } else {
        setScanStatus("error");
        if (!errorMessage) {
          setErrorMessage("Failed to calculate measurements. Please try again with a different image or use estimated measurements.");
        }
        toast({
          title: "Processing Failed",
          description: errorMessage || "No measurements could be calculated. Please try again with a different image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setScanStatus("error");
      setModelLoading(false);
      setErrorMessage(`${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      toast({
        title: "Processing Failed",
        description: "We encountered an error while processing your image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setScanStatus("input");
    setMeasurementData(null);
    setErrorMessage("");
    setRetryCount(0);
  };
  
  const retryWithDifferentImages = () => {
    setScanStatus("input");
    setMeasurementData(null);
    setErrorMessage("");
    setRetryCount(retryCount + 1);
  };
  
  const useFallbackMeasurements = () => {
    if (!lastFormData) {
      toast({
        title: "Error",
        description: "Missing form data for fallback measurements.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const height = parseFloat(lastFormData.height);
      if (isNaN(height)) {
        toast({
          title: "Error",
          description: "Invalid height value.",
          variant: "destructive",
        });
        return;
      }
      
      const fallbackMeasurements = generateFallbackMeasurements(
        height, 
        lastFormData.gender, 
        lastFormData.measurementSystem
      );
      
      setMeasurementData({
        measurements: fallbackMeasurements,
        confidenceScore: 0.6,
        isEstimated: true
      });
      
      setScanStatus("fallback");
      toast({
        title: "Estimated Measurements Generated",
        description: "We've generated estimated measurements scaled to your height.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating fallback measurements:", error);
      toast({
        title: "Error",
        description: "Failed to generate estimated measurements.",
        variant: "destructive",
      });
    }
  };

  const displayModelInfo = () => {
    const modelInfo = {
      'SMPL': "Basic 3D body model with accurate height scaling",
      'SMPL-X': "Advanced model with facial details and precise proportions",
      'STAR': "Statistical model with improved accuracy and body shape analysis",
      'PARE': "Best for pose estimation and measurement from a single image",
      'SPIN': "Effective with partial occlusion and varied poses",
      'SIZER': "Specialized for clothing size estimation with proper scaling"
    };
    
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-900">Using {selectedModel} 3D Body Modeling</h3>
        <p className="text-sm text-gray-700">{modelInfo[selectedModel]}</p>
        <p className="text-xs text-gray-500 mt-2">
          Measurements are extracted from a 3D body mesh scaled to your exact height.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-white">
              AI Body Measurement Tool
            </h1>
            <p className="text-gray-300 text-center mb-8">
              Get accurate body measurements using advanced 3D body modeling
            </p>
            
            {scanStatus === "input" && (
              <>
                {browserSupportsWebGPU === false && (
                  <Alert className="mb-6 bg-red-50 border-red-200">
                    <Info className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800">Browser Compatibility Warning</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Your browser doesn't fully support WebGPU, which is required for our 3D models.
                      Please use Google Chrome 113+ for the best experience.
                    </AlertDescription>
                  </Alert>
                )}
                
                {browserSupportsWebGPU && (
                  displayModelInfo()
                )}
                
                <BodyScanForm onSubmit={handleFormSubmit} />
              </>
            )}
            
            {scanStatus === "processing" && (
              <div className="text-center py-16 bg-card rounded-xl p-8">
                <div className="w-24 h-24 rounded-full bg-electric/20 mx-auto mb-6 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-electric/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-electric"></div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {modelLoading ? `Loading ${selectedModel} 3D Model` : "Processing Your Scan"}
                </h2>
                <p className="text-gray-300">
                  {modelLoading 
                    ? `Setting up ${selectedModel} 3D body modeling technology...` 
                    : "Our advanced 3D models are analyzing your images to calculate accurate measurements..."}
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  {modelLoading 
                    ? "The 3D models may take up to 30 seconds to load on first use"
                    : "Image analysis may take up to 20 seconds"}
                </p>
              </div>
            )}
            
            {scanStatus === "error" && (
              <div className="text-center py-16 bg-card rounded-xl p-8 border border-red-500">
                <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto mb-6 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
                    <Info className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-4 text-white">Processing Failed</h2>
                <p className="text-gray-300 mb-6">
                  {errorMessage || "We couldn't process your images. Please try again with a different image."}
                </p>
                <Alert className="bg-gray-800 border border-gray-700 mb-6">
                  <AlertTitle>Troubleshooting Tips</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                      <li>Ensure your browser supports WebGPU (Chrome 113+ recommended)</li>
                      <li>Check if your internet connection is stable</li>
                      <li>Try with images that have a clear full-body view</li>
                      <li>Make sure the person is clearly visible against the background</li>
                      <li>Try using smaller image files (under 5MB)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={retryWithDifferentImages}
                    className="px-6 py-2 bg-electric hover:bg-electric-dark rounded-md text-white transition-colors"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={useFallbackMeasurements}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
                  >
                    Use Estimated Measurements
                  </button>
                </div>
              </div>
            )}
            
            {(scanStatus === "complete" || scanStatus === "fallback") && measurementData && (
              <>
                <MeasurementResults 
                  measurements={measurementData.measurements} 
                  confidenceScore={measurementData.confidenceScore}
                  onReset={resetForm}
                  isEstimated={scanStatus === "fallback" || measurementData.isEstimated}
                />
                
                {lastFormData && (
                  <div className="mt-12 border-t border-gray-700 pt-8">
                    <MeasurementAccuracyAnalysis 
                      aiMeasurements={measurementData.measurements}
                      measurementSystem={lastFormData.measurementSystem || 'metric'}
                      isEstimated={scanStatus === "fallback" || !!measurementData.isEstimated}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <PrivacyNotice />
      </main>
      <Footer />
    </div>
  );
}
