
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualMeasurementInput from './ManualMeasurementInput';
import MeasurementComparison from './MeasurementComparison';

interface MeasurementAccuracyAnalysisProps {
  aiMeasurements: Record<string, number>;
  measurementSystem: 'metric' | 'imperial';
  isEstimated: boolean;
}

const MeasurementAccuracyAnalysis: React.FC<MeasurementAccuracyAnalysisProps> = ({
  aiMeasurements,
  measurementSystem,
  isEstimated
}) => {
  const [manualMeasurements, setManualMeasurements] = useState<Record<string, number> | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");
  
  const handleSaveMeasurements = (measurements: Record<string, number>) => {
    setManualMeasurements(measurements);
    setActiveTab("comparison");
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-white">Measurement Accuracy Analysis</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="input">Enter Manual Measurements</TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            disabled={!manualMeasurements}
          >
            View Comparison
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <ManualMeasurementInput 
            aiMeasurements={aiMeasurements}
            onSaveMeasurements={handleSaveMeasurements}
            measurementSystem={measurementSystem}
          />
        </TabsContent>
        
        <TabsContent value="comparison">
          {manualMeasurements && (
            <MeasurementComparison
              manualMeasurements={manualMeasurements}
              aiMeasurements={aiMeasurements}
              measurementSystem={measurementSystem}
              isEstimated={isEstimated}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeasurementAccuracyAnalysis;
