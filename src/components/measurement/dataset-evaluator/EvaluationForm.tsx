
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";

interface EvaluationFormProps {
  datasetType: string;
  setDatasetType: (value: string) => void;
  datasetSize: number;
  setDatasetSize: (value: number) => void;
  accuracyLevel: string;
  setAccuracyLevel: (value: string) => void;
  isLoading: boolean;
  onEvaluate: () => void;
}

export default function EvaluationForm({
  datasetType,
  setDatasetType,
  datasetSize,
  setDatasetSize,
  accuracyLevel,
  setAccuracyLevel,
  isLoading,
  onEvaluate
}: EvaluationFormProps) {
  // Add tooltips for datasets
  const datasetInfo = {
    caesar: "CAESAR (Civilian American and European Surface Anthropometry Resource) dataset with 3D body scans of thousands of individuals.",
    renderpeople: "RenderPeople dataset with high-quality 3D scanned human models used for realistic character creation.",
    "3dpw": "3D Poses in the Wild dataset with real-world images and accurate 3D body measurements."
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="dataset-type" className="text-white">Dataset Type</Label>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-gray-800 rounded text-xs invisible group-hover:visible z-10">
              {datasetInfo[datasetType as keyof typeof datasetInfo]}
            </div>
          </div>
        </div>
        <Select value={datasetType} onValueChange={setDatasetType}>
          <SelectTrigger id="dataset-type" className="text-white">
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
          <Label htmlFor="dataset-size" className="text-white">Sample Size</Label>
          <Input 
            id="dataset-size"
            type="number" 
            min={5} 
            max={100}
            value={datasetSize} 
            onChange={(e) => setDatasetSize(parseInt(e.target.value) || 10)}
            className="text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accuracy-level" className="text-white">Accuracy Level</Label>
          <Select value={accuracyLevel} onValueChange={setAccuracyLevel}>
            <SelectTrigger id="accuracy-level" className="text-white">
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
          <Label className="text-white">Loading dataset...</Label>
          <Progress value={45} className="h-2" />
        </div>
      )}
      
      <Button 
        onClick={onEvaluate} 
        disabled={isLoading}
        className="w-full bg-electric hover:bg-electric/80"
      >
        {isLoading ? "Evaluating..." : "Evaluate Against Dataset"}
      </Button>
    </div>
  );
}
