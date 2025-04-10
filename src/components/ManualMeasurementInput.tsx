
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { formatMeasurementName } from '@/utils/measurementStats';
import { toast } from "@/components/ui/use-toast";

interface ManualMeasurementInputProps {
  aiMeasurements: Record<string, number>;
  onSaveMeasurements: (measurements: Record<string, number>) => void;
  measurementSystem: 'metric' | 'imperial';
}

const ManualMeasurementInput: React.FC<ManualMeasurementInputProps> = ({
  aiMeasurements,
  onSaveMeasurements,
  measurementSystem
}) => {
  const [measurements, setMeasurements] = useState<Record<string, number>>({});
  
  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setMeasurements(prev => ({
        ...prev,
        [key]: numValue
      }));
    } else if (value === '') {
      const newMeasurements = { ...measurements };
      delete newMeasurements[key];
      setMeasurements(newMeasurements);
    }
  };
  
  const handleSubmit = () => {
    // Validate that we have at least some measurements
    if (Object.keys(measurements).length < 3) {
      toast({
        title: "Not enough measurements",
        description: "Please enter at least 3 measurements for comparison.",
        variant: "destructive",
      });
      return;
    }
    
    onSaveMeasurements(measurements);
    toast({
      title: "Measurements Saved",
      description: "Your manual measurements have been saved for comparison.",
    });
  };
  
  // Display unit based on measurement system
  const unit = measurementSystem === 'metric' ? 'cm' : 'in';
  
  // Filter out 'height' from the measurement list if it exists
  const measurementKeys = Object.keys(aiMeasurements).filter(key => key !== 'height');
  
  return (
    <Card className="mb-6 bg-blue-950 border-blue-800">
      <CardHeader className="border-b border-blue-800">
        <CardTitle className="text-white text-xl">Enter Your Manual Measurements</CardTitle>
        <CardDescription className="text-blue-300">
          Enter your own measurements to compare with {aiMeasurements.isEstimated ? "estimated" : "AI-derived"} values. Leave fields blank if you don't have that measurement.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {measurementKeys.map(key => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`manual-${key}`} className="text-blue-100">{formatMeasurementName(key)}</Label>
              <div className="flex items-center">
                <Input
                  id={`manual-${key}`}
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${key}`}
                  value={measurements[key] || ''}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  className="text-right bg-blue-900/50 border-blue-700 text-white"
                />
                <span className="ml-2 text-blue-300">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-blue-800 pt-4">
        <Button 
          onClick={handleSubmit} 
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          Compare with {aiMeasurements.isEstimated ? "Estimated" : "AI"} Measurements
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManualMeasurementInput;
