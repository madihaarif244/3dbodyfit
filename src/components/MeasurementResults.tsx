
import { FC, useState } from "react";
import MeasurementCard from "./measurement/MeasurementCard";
import UserImageDisplay from "./measurement/UserImageDisplay";
import DatasetEvaluatorToggle from "./measurement/DatasetEvaluatorToggle";
import VirtualTryOn from "./measurement/VirtualTryOn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Ensure proper gender type conversion
  const gender = typeof measurements.gender === 'number'
    ? (measurements.gender === 1 ? 'male' : measurements.gender === 2 ? 'female' : 'other')
    : (measurements.gender as 'male' | 'female' | 'other' || 'other');
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="measurements" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="measurements"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white text-blue-200"
          >
            Body Measurements
          </TabsTrigger>
          <TabsTrigger 
            value="virtual-try-on"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white text-blue-200"
          >
            Virtual Try-On
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="measurements">
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
        </TabsContent>
        
        <TabsContent value="virtual-try-on">
          <VirtualTryOn 
            measurements={measurements}
            gender={gender}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeasurementResults;
