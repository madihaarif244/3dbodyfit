
import React from "react";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AccuracyIndicatorProps {
  confidenceScore: number;
  isEstimated?: boolean;
}

const AccuracyIndicator: React.FC<AccuracyIndicatorProps> = ({ confidenceScore, isEstimated = false }) => {
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
    <div className="flex items-center gap-2">
      <Badge className={`flex items-center gap-1 ${accuracyIndicator.color}`}>
        {accuracyIndicator.icon} {accuracyIndicator.label} {isEstimated ? "(Estimated)" : ""}
      </Badge>
      <span className="text-xs text-gray-300">{accuracyIndicator.expected}</span>
    </div>
  );
};

export default AccuracyIndicator;
