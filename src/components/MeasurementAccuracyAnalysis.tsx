
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
    <div className="bg-blue-900/30 p-6 rounded-xl">
      <h3 className="text-2xl font-semibold mb-6 text-white">Measurement Accuracy Analysis</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger 
            value="input" 
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white text-blue-200"
          >
            Enter Manual Measurements
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            disabled={!manualMeasurements}
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white text-blue-200"
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
