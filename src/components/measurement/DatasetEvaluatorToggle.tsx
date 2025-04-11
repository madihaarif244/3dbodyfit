
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DatasetEvaluator from "../DatasetEvaluator";

interface DatasetEvaluatorToggleProps {
  measurements: Record<string, number>;
}

export default function DatasetEvaluatorToggle({ measurements }: DatasetEvaluatorToggleProps) {
  const [showDatasetEvaluation, setShowDatasetEvaluation] = useState<boolean>(false);
  
  return (
    <div>
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowDatasetEvaluation(!showDatasetEvaluation)}
        >
          {showDatasetEvaluation ? "Hide" : "Show"} Dataset Evaluation Tools
        </Button>
      </div>
      
      {showDatasetEvaluation && (
        <div className="mt-4">
          <DatasetEvaluator measurements={measurements} />
        </div>
      )}
    </div>
  );
}
