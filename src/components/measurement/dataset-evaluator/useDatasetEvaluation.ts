
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { calculateMAE, calculatePercentageDeviation } from "@/utils/measurementStats";
import { loadDataset } from "@/utils/datasetUtils";
import type { EvaluationResults } from "./DatasetEvaluator";

export function useDatasetEvaluation(measurements: Record<string, number>) {
  const [datasetSize, setDatasetSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accuracyLevel, setAccuracyLevel] = useState<string>("standard");
  const [results, setResults] = useState<EvaluationResults | null>(null);

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      // Use only the CAESAR dataset
      const dataset = await loadDataset("caesar", datasetSize, accuracyLevel);
      
      // Calculate average error across all samples with improved measurement weighting
      let totalMAE = 0;
      let totalPercentage = 0;
      let measurementDeviations: Record<string, {total: number, count: number, maeTotal: number}> = {};
      
      // Specify key measurements to always track
      const keyMeasurementTypes = ['chest', 'waist', 'hips', 'shoulder', 'inseam', 'sleeve', 'neck', 'thigh'];
      keyMeasurementTypes.forEach(key => {
        if (measurements[key]) {
          measurementDeviations[key] = {total: 0, count: 0, maeTotal: 0};
        }
      });
      
      // Process each sample in the dataset
      dataset.samples.forEach(sample => {
        const maeResult = calculateMAE(sample.measurements, measurements);
        const percentageResult = calculatePercentageDeviation(sample.measurements, measurements);
        
        totalMAE += maeResult.overall;
        totalPercentage += percentageResult.overall;
        
        // Track individual measurement deviations
        Object.keys(maeResult.byMeasurement).forEach(key => {
          if (!measurementDeviations[key]) {
            measurementDeviations[key] = {total: 0, count: 0, maeTotal: 0};
          }
          measurementDeviations[key].total += percentageResult.byMeasurement[key] || 0;
          measurementDeviations[key].maeTotal += maeResult.byMeasurement[key] || 0;
          measurementDeviations[key].count += 1;
        });
      });
      
      // Process key measurement deviations
      let keyMeasurements = Object.keys(measurementDeviations)
        .filter(key => measurementDeviations[key].count > 0)
        .map(key => ({
          name: key,
          deviation: measurementDeviations[key].total / measurementDeviations[key].count,
          mae: measurementDeviations[key].maeTotal / measurementDeviations[key].count
        }))
        .sort((a, b) => b.deviation - a.deviation);
      
      // Ensure priority measurements are included
      const ensurePriorityMeasurements = ['chest', 'waist', 'hips'];
      ensurePriorityMeasurements.forEach(priority => {
        if (!keyMeasurements.some(m => m.name === priority) && measurements[priority]) {
          keyMeasurements.unshift({
            name: priority,
            deviation: 0,
            mae: 0
          });
        }
      });
      
      // Set the results with proper rounding
      setResults({
        mae: Math.round((totalMAE / dataset.samples.length) * 10) / 10,
        percentageDeviation: Math.round((totalPercentage / dataset.samples.length) * 10) / 10,
        sampleCount: dataset.samples.length,
        keyMeasurements: keyMeasurements.map(item => ({
          name: item.name,
          deviation: Math.round(item.deviation * 10) / 10,
          mae: Math.round(item.mae * 10) / 10
        }))
      });
      
      // Show success message
      const accuracyDesc = accuracyLevel === "research-grade" ? "research-grade accuracy" :
                          accuracyLevel === "high" ? "high accuracy" : "standard accuracy";
      
      toast({
        title: "Evaluation Complete",
        description: `Evaluated ${dataset.samples.length} samples from CAESAR dataset with ${accuracyDesc}`,
      });
    } catch (error) {
      console.error("Dataset evaluation error:", error);
      toast({
        title: "Evaluation Failed",
        description: "Failed to evaluate against dataset. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    datasetSize,
    setDatasetSize,
    accuracyLevel,
    setAccuracyLevel,
    isLoading,
    results,
    handleEvaluate
  };
}
