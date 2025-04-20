
import { FC, useState } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AccuracyIndicator from "./measurement/AccuracyIndicator";
import SizeRecommendations from "./measurement/SizeRecommendations";

interface MeasurementResultsProps {
  measurements: Record<string, number>;
  confidenceScore: number;
  onReset: () => void;
  isEstimated?: boolean;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
  userImage?: string;
}

const MeasurementResults: FC<MeasurementResultsProps> = ({ 
  measurements, 
  confidenceScore, 
  onReset,
  isEstimated = false,
  landmarks,
  userImage
}) => {
  const [activeTab, setActiveTab] = useState<string>("measurements");
  const hasLandmarks = landmarks && Object.keys(landmarks).length > 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-white">Measurement Results</div>
        <AccuracyIndicator confidenceScore={confidenceScore} isEstimated={isEstimated} />
      </div>
      
      {confidenceScore < 0.87 && (
        <Alert variant="default" className="bg-amber-900/30 border-amber-600">
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
                Measurements
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm">
                Size Recommendations
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
              <SizeRecommendations
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
