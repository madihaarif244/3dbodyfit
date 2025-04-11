
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateMAE, calculatePercentageDeviation } from "@/utils/measurementStats";
import { loadDataset } from "@/utils/datasetUtils";
import { toast } from "@/components/ui/use-toast";

export interface DatasetEvaluatorProps {
  measurements: Record<string, number>;
}

export default function DatasetEvaluator({ measurements }: DatasetEvaluatorProps) {
  const [datasetType, setDatasetType] = useState<string>("caesar");
  const [datasetSize, setDatasetSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{
    mae: number;
    percentageDeviation: number;
    sampleCount: number;
  } | null>(null);

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const dataset = await loadDataset(datasetType, datasetSize);
      
      // Calculate average error across all samples
      let totalMAE = 0;
      let totalPercentage = 0;
      
      dataset.samples.forEach(sample => {
        const maeResult = calculateMAE(sample.measurements, measurements);
        const percentageResult = calculatePercentageDeviation(sample.measurements, measurements);
        
        totalMAE += maeResult.overall;
        totalPercentage += percentageResult.overall;
      });
      
      setResults({
        mae: totalMAE / dataset.samples.length,
        percentageDeviation: totalPercentage / dataset.samples.length,
        sampleCount: dataset.samples.length
      });
      
      toast({
        title: "Evaluation Complete",
        description: `Evaluated ${dataset.samples.length} samples from ${datasetType.toUpperCase()} dataset`,
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

  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Dataset Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataset-type">Dataset Type</Label>
          <Select value={datasetType} onValueChange={setDatasetType}>
            <SelectTrigger id="dataset-type">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caesar">CAESAR Dataset</SelectItem>
              <SelectItem value="renderpeople">RenderPeople</SelectItem>
              <SelectItem value="3dpw">3DPW Dataset</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataset-size">Sample Size</Label>
          <Input 
            id="dataset-size"
            type="number" 
            min={1} 
            max={100}
            value={datasetSize} 
            onChange={(e) => setDatasetSize(parseInt(e.target.value) || 10)}
          />
        </div>
        
        {isLoading && (
          <div className="space-y-2 py-2">
            <Label>Loading dataset...</Label>
            <Progress value={45} className="h-2" />
          </div>
        )}
        
        {results && (
          <div className="space-y-3 py-2">
            <h3 className="font-medium">Results ({results.sampleCount} samples)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-sm text-gray-400">Mean Absolute Error</div>
                <div className="text-lg font-semibold text-white">{results.mae.toFixed(2)} cm</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-sm text-gray-400">Percentage Deviation</div>
                <div className="text-lg font-semibold text-white">{results.percentageDeviation.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleEvaluate} 
          disabled={isLoading}
          className="w-full bg-electric hover:bg-electric/80"
        >
          {isLoading ? "Evaluating..." : "Evaluate Against Dataset"}
        </Button>
      </CardFooter>
    </Card>
  );
}
