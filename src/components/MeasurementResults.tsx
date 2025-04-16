
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
  
  // Calculate accuracy level based on confidence score with improved thresholds
  const getAccuracyIndicator = () => {
    if (confidenceScore >= 0.94) return { label: "Excellent", color: "bg-green-500 text-white" };
    if (confidenceScore >= 0.89) return { label: "Very Good", color: "bg-emerald-500 text-white" };
    if (confidenceScore >= 0.82) return { label: "Good", color: "bg-blue-500 text-white" };
    if (confidenceScore >= 0.75) return { label: "Fair", color: "bg-amber-500 text-black" };
    return { label: "Estimated", color: "bg-red-500 text-white" };
  };
  
  const accuracyIndicator = getAccuracyIndicator();
  
  // Estimated expected deviation percentage based on confidence score
  const getEstimatedDeviation = () => {
    if (confidenceScore >= 0.94) return "±2-4%";
    if (confidenceScore >= 0.89) return "±4-6%";
    if (confidenceScore >= 0.82) return "±6-8%";
    if (confidenceScore >= 0.75) return "±8-10%";
    return ">±10%";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-white">Measurement Results</div>
        <div className="flex items-center gap-2">
          <Badge className={accuracyIndicator.color}>
            {accuracyIndicator.label} {isEstimated ? "(Estimated)" : ""}
          </Badge>
          <span className="text-xs text-gray-300">{getEstimatedDeviation()}</span>
        </div>
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
