
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { calculateMAE, calculatePercentageDeviation } from "@/utils/measurementStats";
import { loadDataset } from "@/utils/datasetUtils";
import { exportToCSV, formatEvaluationResultsForExport } from "@/utils/exportUtils";

import EvaluationForm from "./EvaluationForm";
import ResultsSummary from "./ResultsSummary";
import DetailedAnalysis from "./DetailedAnalysis";

export interface DatasetEvaluatorProps {
  measurements: Record<string, number>;
}

export interface EvaluationResults {
  mae: number;
  percentageDeviation: number;
  sampleCount: number;
  keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
}

export default function DatasetEvaluator({ measurements }: DatasetEvaluatorProps) {
  const [datasetSize, setDatasetSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accuracyLevel, setAccuracyLevel] = useState<string>("standard");
  const [results, setResults] = useState<EvaluationResults | null>(null);
  
  // Always use 3DPW dataset
  const datasetType = "3dpw";

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const dataset = await loadDataset(datasetType, datasetSize);
      
      // Calculate average error across all samples
      let totalMAE = 0;
      let totalPercentage = 0;
      let measurementDeviations: Record<string, {total: number, count: number, maeTotal: number}> = {};
      
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
      const keyMeasurements = Object.keys(measurementDeviations).map(key => ({
        name: key,
        deviation: measurementDeviations[key].total / measurementDeviations[key].count,
        mae: measurementDeviations[key].maeTotal / measurementDeviations[key].count
      })).sort((a, b) => b.deviation - a.deviation);
      
      setResults({
        mae: totalMAE / dataset.samples.length,
        percentageDeviation: totalPercentage / dataset.samples.length,
        sampleCount: dataset.samples.length,
        keyMeasurements
      });
      
      toast({
        title: "Evaluation Complete",
        description: `Evaluated ${dataset.samples.length} samples from 3DPW dataset`,
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

  const handleDownloadReport = () => {
    if (!results) return;
    
    try {
      // Format and export the data
      const exportData = formatEvaluationResultsForExport(results, datasetType);
      const filename = `accuracy-report-3dpw-${new Date().toISOString().split('T')[0]}.csv`;
      
      exportToCSV(exportData, filename);
      
      toast({
        title: "Report Downloaded",
        description: `Accuracy report has been downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the report. See console for details.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white text-center">3DPW Dataset Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EvaluationForm 
          datasetSize={datasetSize}
          setDatasetSize={setDatasetSize}
          accuracyLevel={accuracyLevel}
          setAccuracyLevel={setAccuracyLevel}
          isLoading={isLoading}
          onEvaluate={handleEvaluate}
        />
        
        {results && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            </TabsList>
            <ResultsSummary results={results} />
            <DetailedAnalysis results={results} />
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {results && (
          <Button 
            variant="outline" 
            className="w-full gap-2 text-sm text-white"
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4" /> Download Accuracy Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
