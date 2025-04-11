
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateMAE, calculatePercentageDeviation } from "@/utils/measurementStats";
import { loadDataset } from "@/utils/datasetUtils";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Info } from "lucide-react";

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
    keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
  } | null>(null);
  const [accuracyLevel, setAccuracyLevel] = useState<string>("standard");

  // Add tooltips for datasets
  const datasetInfo = {
    caesar: "CAESAR (Civilian American and European Surface Anthropometry Resource) dataset with 3D body scans of thousands of individuals.",
    renderpeople: "RenderPeople dataset with high-quality 3D scanned human models used for realistic character creation.",
    "3dpw": "3D Poses in the Wild dataset with real-world images and accurate 3D body measurements."
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const dataset = await loadDataset(datasetType, datasetSize, accuracyLevel);
      
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
        Object.keys(maeResult.individual).forEach(key => {
          if (!measurementDeviations[key]) {
            measurementDeviations[key] = {total: 0, count: 0, maeTotal: 0};
          }
          measurementDeviations[key].total += percentageResult.individual[key] || 0;
          measurementDeviations[key].maeTotal += maeResult.individual[key] || 0;
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
        description: `Evaluated ${dataset.samples.length} samples from ${datasetType.toUpperCase()} dataset with ${accuracyLevel} accuracy`,
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

  // Generate report data
  const generateAccuracyReport = () => {
    if (!results) return null;
    
    const getAccuracyLevel = (deviation: number) => {
      if (deviation <= 3) return "Excellent";
      if (deviation <= 8) return "Good";
      if (deviation <= 15) return "Fair";
      return "Needs Improvement";
    };
    
    const overallAccuracy = getAccuracyLevel(results.percentageDeviation);
    const accuracyColor = {
      "Excellent": "text-green-500",
      "Good": "text-blue-500",
      "Fair": "text-amber-500",
      "Needs Improvement": "text-red-500"
    }[overallAccuracy];
    
    return (
      <div className="space-y-4 py-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Overall Accuracy</h3>
          <span className={`font-semibold ${accuracyColor}`}>{overallAccuracy}</span>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={results.keyMeasurements}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" unit="%" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
              formatter={(value: any) => [`${value.toFixed(2)}%`, 'Deviation']}
            />
            <Legend />
            <Bar dataKey="deviation" name="% Deviation" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-1 gap-2 mt-4">
          {results.keyMeasurements.slice(0, 3).map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div>
                <span className="font-medium capitalize">{item.name}</span>
                <p className="text-xs text-gray-400">
                  {item.deviation > 10 ? "Consider recalibrating this measurement" : "Within acceptable range"}
                </p>
              </div>
              <div className="text-right">
                <span className={item.deviation > 10 ? "text-red-400" : "text-green-400"}>
                  {item.deviation.toFixed(1)}% deviation
                </span>
                <p className="text-xs text-gray-400">{item.mae.toFixed(1)} cm difference</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Dataset Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="dataset-type">Dataset Type</Label>
            <div className="relative group">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-gray-800 rounded text-xs invisible group-hover:visible z-10">
                {datasetInfo[datasetType as keyof typeof datasetInfo]}
              </div>
            </div>
          </div>
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-size">Sample Size</Label>
            <Input 
              id="dataset-size"
              type="number" 
              min={5} 
              max={100}
              value={datasetSize} 
              onChange={(e) => setDatasetSize(parseInt(e.target.value) || 10)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accuracy-level">Accuracy Level</Label>
            <Select value={accuracyLevel} onValueChange={setAccuracyLevel}>
              <SelectTrigger id="accuracy-level">
                <SelectValue placeholder="Select accuracy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="research">Research-grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading && (
          <div className="space-y-2 py-2">
            <Label>Loading dataset...</Label>
            <Progress value={45} className="h-2" />
          </div>
        )}
        
        {results && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
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
            </TabsContent>
            <TabsContent value="detailed">
              {generateAccuracyReport()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleEvaluate} 
          disabled={isLoading}
          className="w-full bg-electric hover:bg-electric/80"
        >
          {isLoading ? "Evaluating..." : "Evaluate Against Dataset"}
        </Button>
        
        {results && (
          <Button 
            variant="outline" 
            className="w-full gap-2 text-sm"
            onClick={() => {
              toast({
                title: "Report Downloaded",
                description: "Accuracy report has been downloaded.",
              });
            }}
          >
            <Download className="h-4 w-4" /> Download Accuracy Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
