
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Redo, Download, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MeasurementItem } from "./MeasurementItem";
import { SystemToggle } from "./SystemToggle";
import { formatHeight } from "@/utils/formatMeasurements";

interface MeasurementCardProps {
  measurements: Record<string, number>;
  confidenceScore: number;
  onReset: () => void;
  isEstimated?: boolean;
  userImage?: string;
}

export default function MeasurementCard({
  measurements,
  confidenceScore,
  onReset,
  isEstimated = false,
  userImage
}: MeasurementCardProps) {
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric");
  
  const toggleMeasurementSystem = () => {
    setMeasurementSystem(measurementSystem === "metric" ? "imperial" : "metric");
  };
  
  const displayedMeasurements = [
    { name: "Chest", value: measurements.chest },
    { name: "Waist", value: measurements.waist },
    { name: "Hips", value: measurements.hips },
    { name: "Shoulder", value: measurements.shoulder },
    { name: "Inseam", value: measurements.inseam },
    { name: "Sleeve", value: measurements.sleeve }
  ];
  
  const additionalMeasurements = [
    { name: "Neck", value: measurements.neck },
    { name: "Thigh", value: measurements.thigh },
    { name: "Upper Arm", value: measurements.upperArm },
    { name: "Forearm", value: measurements.forearm },
    { name: "Calf", value: measurements.calf },
    { name: "Neck Circumference", value: measurements.neckCircumference },
    { name: "Shoulder Width", value: measurements.shoulderWidth }
  ].filter(item => item.value !== undefined);

  const getAvatarFallback = () => {
    const gender = measurements.hasOwnProperty('gender') ? String(measurements.gender) : 'U';
    if (gender === 'male' || gender === 'Male') return 'M';
    if (gender === 'female' || gender === 'Female') return 'F';
    return 'U';
  };
  
  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            {userImage && (
              <Avatar className="h-14 w-14 border-2 border-electric">
                <AvatarImage src={userImage} alt="User photo" />
                <AvatarFallback className="bg-gray-700 text-white">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="text-xl font-semibold text-white">Your Body Measurements</CardTitle>
          </div>
          <SystemToggle 
            measurementSystem={measurementSystem} 
            onToggle={toggleMeasurementSystem}
          />
        </div>
        
        <div className="text-sm text-gray-400 flex items-center gap-2">
          Height: <span className="font-medium text-electric">{formatHeight(measurements.height, measurementSystem)}</span>
          {isEstimated && <span className="text-xs text-amber-400">(Estimated)</span>}
        </div>
        
        <div className="flex items-center mt-1 gap-1">
          <div className="h-2 bg-blue-900/50 rounded-full flex-grow">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-electric rounded-full" 
              style={{ width: `${confidenceScore * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{Math.round(confidenceScore * 100)}% accuracy</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {displayedMeasurements.map((item) => (
            <MeasurementItem
              key={item.name}
              name={item.name}
              value={item.value}
              measurementSystem={measurementSystem}
              variant="primary"
            />
          ))}
        </div>
        
        {additionalMeasurements.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Advanced Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              {additionalMeasurements.map((item) => (
                <MeasurementItem
                  key={item.name}
                  name={item.name}
                  value={item.value}
                  measurementSystem={measurementSystem}
                  variant="secondary"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Download className="h-3 w-3" />
          Save As PDF
        </Button>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Share2 className="h-3 w-3" />
          Share
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="ml-auto gap-1 text-xs hover:bg-gray-700"
        >
          <Redo className="h-3 w-3" />
          Scan Again
        </Button>
      </CardFooter>
    </Card>
  );
}

