
import { FC } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

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
        <Alert variant="warning" className="bg-amber-900/30 border-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-amber-200 text-sm">
            For higher accuracy, consider providing clearer images with good lighting and proper pose.
          </AlertDescription>
        </Alert>
      )}
      
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
