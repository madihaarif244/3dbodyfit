
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualMeasurementInput from './ManualMeasurementInput';
import MeasurementComparison from './MeasurementComparison';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    // Ensure we don't pass empty measurements
    if (Object.keys(measurements).length === 0) {
      return;
    }
    
    // Remove any 'height' measurement if present in manual measurements
    // to prevent it from being compared (since it's used as reference)
    const filteredMeasurements = { ...measurements };
    if ('height' in filteredMeasurements) {
      delete filteredMeasurements.height;
    }
    
    setManualMeasurements(filteredMeasurements);
    setActiveTab("comparison");
  };
  
  return (
    <div className="bg-blue-900/30 p-6 rounded-xl">
      <h3 className="text-2xl font-semibold mb-6 text-white">Measurement Accuracy Analysis</h3>
      
      {isEstimated && (
        <Alert className="mb-6 bg-yellow-900/30 border-yellow-600 text-yellow-200">
          <Info className="h-5 w-5 text-yellow-400" />
          <AlertDescription>
            You are comparing with estimated measurements. For best accuracy, use AI-derived measurements.
          </AlertDescription>
        </Alert>
      )}
      
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
          {manualMeasurements && Object.keys(manualMeasurements).length > 0 && (
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
