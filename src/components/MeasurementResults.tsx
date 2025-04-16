
import { FC } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import { Badge } from "./ui/badge";

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
  const hasLandmarks = landmarks && Object.keys(landmarks).length > 0;
  
  // Calculate accuracy level based on confidence score
  const getAccuracyIndicator = () => {
    if (confidenceScore >= 0.95) return { label: "Excellent", color: "bg-green-500 text-white" };
    if (confidenceScore >= 0.90) return { label: "Very Good", color: "bg-emerald-500 text-white" };
    if (confidenceScore >= 0.80) return { label: "Good", color: "bg-blue-500 text-white" };
    if (confidenceScore >= 0.70) return { label: "Fair", color: "bg-amber-500 text-black" };
    return { label: "Estimated", color: "bg-red-500 text-white" };
  };
  
  const accuracyIndicator = getAccuracyIndicator();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-white">Measurement Results</div>
        <Badge className={accuracyIndicator.color}>
          {accuracyIndicator.label} {isEstimated ? "(Estimated)" : "Accuracy"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MeasurementCard
            measurements={measurements}
            confidenceScore={confidenceScore}
            onReset={onReset}
            isEstimated={isEstimated}
            userImage={userImage}
          />
          
          <DatasetEvaluatorToggle measurements={measurements} />
        </div>
        
        <UserImageDisplay 
          userImage={userImage} 
          hasLandmarks={hasLandmarks}
        />
      </div>
    </div>
  );
};

export default MeasurementResults;
