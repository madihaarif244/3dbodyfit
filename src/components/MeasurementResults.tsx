
import { FC, useState } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Info, Ruler } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MeasurementResultsProps {
  measurements: Record<string, number>;
  confidenceScore: number;
  onReset: () => void;
  isEstimated?: boolean;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
  userImage?: string;
}

interface SizeRecommendation {
  garment: string;
  recommendedSize: string;
  fit: string;
  confidence: number;
}

const MeasurementResults: FC<MeasurementResultsProps> = ({ 
  measurements, 
  confidenceScore, 
  onReset,
  isEstimated = false,
  landmarks,
  userImage
}) => {
  const [activeTab, setActiveTab] = useState<string>("recommendations");
  const hasLandmarks = landmarks && Object.keys(landmarks).length > 0;
  
  // Calculate accuracy level based on confidence score with improved thresholds
  const getAccuracyIndicator = () => {
    if (confidenceScore >= 0.96) return { 
      label: "Excellent", 
      color: "bg-green-500 text-white",
      expected: "±2-3%",
      icon: <CheckCircle2 className="h-4 w-4" />
    };
    if (confidenceScore >= 0.92) return { 
      label: "Very Good", 
      color: "bg-emerald-500 text-white",
      expected: "±3-5%",
      icon: <CheckCircle2 className="h-4 w-4" />
    };
    if (confidenceScore >= 0.87) return { 
      label: "Good", 
      color: "bg-blue-500 text-white",
      expected: "±5-7%",
      icon: <Info className="h-4 w-4" />
    };
    if (confidenceScore >= 0.82) return { 
      label: "Fair", 
      color: "bg-amber-500 text-black",
      expected: "±7-9%",
      icon: <AlertCircle className="h-4 w-4" />
    };
    return { 
      label: "Estimated", 
      color: "bg-red-500 text-white",
      expected: ">±9%",
      icon: <AlertCircle className="h-4 w-4" />
    };
  };
  
  // Generate size recommendations based on measurements
  const generateSizeRecommendations = (): SizeRecommendation[] => {
    const recommendations: SizeRecommendation[] = [];
    
    // Helper function to determine size - Fixed TypeScript error by using tuple type
    const determineSize = (measurement: number, ranges: Record<string, [number, number]>): string => {
      for (const [size, [min, max]] of Object.entries(ranges)) {
        if (measurement >= min && measurement <= max) {
          return size;
        }
      }
      return measurement > Object.values(ranges)[Object.values(ranges).length - 1][1] 
        ? Object.keys(ranges)[Object.keys(ranges).length - 1] 
        : Object.keys(ranges)[0];
    };
    
    // Helper function to determine fit
    const determineFit = (measurement: number, ranges: Record<string, [number, number]>, size: string): string => {
      const [min, max] = ranges[size];
      const mid = (min + max) / 2;
      
      if (measurement < min + (max - min) * 0.2) return "Slim";
      if (measurement > min + (max - min) * 0.8) return "Relaxed";
      return "Regular";
    };
    
    // Add recommendations based on chest/bust - Fixed TypeScript error with correct tuple type
    if (measurements.chest) {
      const chestRanges: Record<string, [number, number]> = {
        'XS': [80, 88],
        'S': [88, 96],
        'M': [96, 104],
        'L': [104, 112],
        'XL': [112, 120],
        'XXL': [120, 128]
      };
      
      const size = determineSize(measurements.chest, chestRanges);
      const fit = determineFit(measurements.chest, chestRanges, size);
      
      recommendations.push({
        garment: "Shirt/T-Shirt",
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.95
      });
      
      recommendations.push({
        garment: "Button-up Shirt",
        recommendedSize: size,
        fit: fit === "Regular" ? "Standard" : fit,
        confidence: confidenceScore * 0.9
      });
    }
    
    // Add recommendations based on waist - Fixed TypeScript error with correct tuple type
    if (measurements.waist) {
      const waistRanges: Record<string, [number, number]> = {
        'XS': [65, 73],
        'S': [73, 81],
        'M': [81, 89],
        'L': [89, 97],
        'XL': [97, 105],
        'XXL': [105, 113]
      };
      
      const size = determineSize(measurements.waist, waistRanges);
      const fit = determineFit(measurements.waist, waistRanges, size);
      
      recommendations.push({
        garment: "Pants/Trousers",
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.92
      });
    }
    
    // Add recommendations based on hips - Fixed TypeScript error with correct tuple type
    if (measurements.hips) {
      const hipRanges: Record<string, [number, number]> = {
        'XS': [85, 93],
        'S': [93, 101],
        'M': [101, 109],
        'L': [109, 117],
        'XL': [117, 125],
        'XXL': [125, 133]
      };
      
      const size = determineSize(measurements.hips, hipRanges);
      const fit = determineFit(measurements.hips, hipRanges, size);
      
      recommendations.push({
        garment: "Skirt/Dress",
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.88
      });
    }
    
    // If we have inseam measurement, add pants length recommendation
    if (measurements.inseam) {
      let lengthRec = "Regular";
      if (measurements.inseam < 76) lengthRec = "Short";
      if (measurements.inseam > 86) lengthRec = "Long";
      
      recommendations.push({
        garment: "Pants Length",
        recommendedSize: lengthRec,
        fit: "Standard",
        confidence: confidenceScore * 0.85
      });
    }
    
    return recommendations;
  };
  
  const sizeRecommendations = generateSizeRecommendations();
  const accuracyIndicator = getAccuracyIndicator();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-white">Measurement Results</div>
        <div className="flex items-center gap-2">
          <Badge className={`flex items-center gap-1 ${accuracyIndicator.color}`}>
            {accuracyIndicator.icon} {accuracyIndicator.label} {isEstimated ? "(Estimated)" : ""}
          </Badge>
          <span className="text-xs text-gray-300">{accuracyIndicator.expected}</span>
        </div>
      </div>
      
      {confidenceScore < 0.87 && (
        <Alert className="bg-amber-900/30 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-amber-200 text-sm">
            For higher accuracy, consider providing clearer images with good lighting and proper pose.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="measurements" className="text-sm">
                Body Measurements
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm">
                Virtual Try-On
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="measurements" className="mt-0">
              <MeasurementCard
                measurements={measurements}
                confidenceScore={confidenceScore}
                onReset={onReset}
                isEstimated={isEstimated}
                userImage={userImage}
              />
              
              <DatasetEvaluatorToggle measurements={measurements} />
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              <div className="bg-white rounded-lg p-4 shadow-md text-black">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                  <Ruler className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Virtual Try-On Size Recommendations</h3>
                </div>
                
                {sizeRecommendations.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Based on your measurements, we recommend the following sizes:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {sizeRecommendations.filter(rec => rec.garment === "Button-up Shirt").map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium text-blue-700">{rec.garment}</h4>
                            <span className="text-sm text-gray-500">Optimal chest: {measurements.chest?.toFixed(1)} cm</span>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                              <div 
                                key={size}
                                className={`text-center flex-1 py-1 px-2 rounded ${
                                  size === rec.recommendedSize 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {size}
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-center py-2 bg-gray-50 rounded text-sm">
                            This will be a <strong>{rec.fit} fit</strong> on your chest.
                          </div>
                          
                          <div className="mt-3 pt-2 border-t text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span>Fit Details:</span>
                              <div className="ml-1 flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${rec.confidence * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-4 text-xs font-medium text-gray-500 border-b pb-1 mt-4">
                      <div>Other Garments</div>
                      <div>Size</div>
                      <div>Fit</div>
                      <div>Accuracy</div>
                    </div>
                    
                    {sizeRecommendations.filter(rec => rec.garment !== "Button-up Shirt").map((rec, index) => (
                      <div key={index} className="grid grid-cols-4 py-2 border-b border-gray-100 items-center text-sm">
                        <div className="font-medium">{rec.garment}</div>
                        <div className="font-bold text-blue-700">{rec.recommendedSize}</div>
                        <div>{rec.fit}</div>
                        <div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${rec.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                      <p>These recommendations are generated based on standard sizing charts and your body measurements.</p>
                      <p className="mt-1">Actual fit may vary by brand and style preferences.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Insufficient measurement data to generate size recommendations.</p>
                    <p className="text-sm mt-2">Please ensure chest, waist, and hip measurements are available.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <UserImageDisplay 
          userImage={userImage} 
          hasLandmarks={hasLandmarks}
          measurements={measurements}
          landmarks={landmarks}
        />
      </div>
    </div>
  );
};

export default MeasurementResults;
