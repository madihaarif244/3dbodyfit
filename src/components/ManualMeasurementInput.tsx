
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Enter Your Manual Measurements</CardTitle>
        <CardDescription>
          Enter your own measurements to compare with AI-derived values. Leave fields blank if you don't have that measurement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {measurementKeys.map(key => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`manual-${key}`}>{formatMeasurementName(key)}</Label>
              <div className="flex items-center">
                <Input
                  id={`manual-${key}`}
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${key}`}
                  value={measurements[key] || ''}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  className="text-right"
                />
                <span className="ml-2 text-muted-foreground">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="ml-auto">
          Compare with AI Measurements
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManualMeasurementInput;
