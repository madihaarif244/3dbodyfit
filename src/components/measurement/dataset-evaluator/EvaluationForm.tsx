
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";

interface EvaluationFormProps {
  datasetSize: number;
  setDatasetSize: (value: number) => void;
  accuracyLevel: string;
  setAccuracyLevel: (value: string) => void;
  isLoading: boolean;
  onEvaluate: () => void;
}

export default function EvaluationForm({
  datasetSize,
  setDatasetSize,
  accuracyLevel,
  setAccuracyLevel,
  isLoading,
  onEvaluate
}: EvaluationFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="dataset-info" className="text-foreground">Dataset Information</Label>
          <div className="relative group">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-background border border-border rounded text-xs invisible group-hover:visible z-10 text-foreground">
              3D Poses in the Wild dataset with real-world images and accurate 3D body measurements.
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300">
          Using 3D Poses in the Wild (3DPW) dataset
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataset-size" className="text-foreground">Sample Size</Label>
          <Input 
            id="dataset-size"
            type="number" 
            min={5} 
            max={100}
            value={datasetSize} 
            onChange={(e) => setDatasetSize(parseInt(e.target.value) || 10)}
            className="text-foreground"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accuracy-level" className="text-foreground">Accuracy Level</Label>
          <Select value={accuracyLevel} onValueChange={setAccuracyLevel}>
            <SelectTrigger id="accuracy-level" className="text-foreground">
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
          <Label className="text-foreground">Loading dataset...</Label>
          <Progress value={45} className="h-2" />
        </div>
      )}
      
      <Button 
        onClick={onEvaluate} 
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? "Evaluating..." : "Evaluate Against 3DPW Dataset"}
      </Button>
    </div>
  );
}
