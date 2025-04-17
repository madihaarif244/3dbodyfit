import { FC, useState } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import VirtualTryOn from './measurement/VirtualTryOn';
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
  
  const generateSizeRecommendations = (): SizeRecommendation[] => {
    const recommendations: SizeRecommendation[] = [];
    
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
    
    const determineFit = (measurement: number, ranges: Record<string, [number, number]>, size: string): string => {
      const [min, max] = ranges[size];
      const mid = (min + max) / 2;
      
      if (measurement < min + (max - min) * 0.2) return "Slim";
      if (measurement > min + (max - min) * 0.8) return "Relaxed";
      return "Regular";
    };
    
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
              <VirtualTryOn 
                measurements={measurements}
                confidenceScore={confidenceScore}
              />
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
