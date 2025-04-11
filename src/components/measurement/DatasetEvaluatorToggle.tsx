
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DatasetEvaluator from "../DatasetEvaluator";

interface DatasetEvaluatorToggleProps {
  measurements: Record<string, number>;
}

export default function DatasetEvaluatorToggle({ measurements }: DatasetEvaluatorToggleProps) {
  const [showDatasetEvaluation, setShowDatasetEvaluation] = useState<boolean>(false);
  
  return (
    <div className="w-full">
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full bg-blue-800/30 hover:bg-blue-700/50 text-white"
          onClick={() => setShowDatasetEvaluation(!showDatasetEvaluation)}
        >
          {showDatasetEvaluation ? "Hide" : "Show"} Advanced Accuracy Assessment
        </Button>
      </div>
      
      {showDatasetEvaluation && (
        <div className="mt-4 flex justify-center items-center w-full">
          <div className="w-full max-w-4xl mx-auto">
            <DatasetEvaluator measurements={measurements} />
          </div>
        </div>
      )}
    </div>
  );
}
