
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { EvaluationResults } from "./DatasetEvaluator";
import { Progress } from "@/components/ui/progress";

interface ResultsSummaryProps {
  results: EvaluationResults | null;
}

export default function ResultsSummary({ results }: ResultsSummaryProps) {
  if (!results) return null;
  
  // Determine accuracy level based on percentage deviation
  const getAccuracyLevel = (deviation: number) => {
    if (deviation <= 3) return { label: "Excellent", color: "bg-green-500 text-white" };
    if (deviation <= 5) return { label: "Good", color: "bg-blue-500 text-white" };
    if (deviation <= 8) return { label: "Fair", color: "bg-amber-500 text-black" };
    return { label: "Needs Improvement", color: "bg-red-500 text-white" };
  };
  
  const accuracyLevel = getAccuracyLevel(results.percentageDeviation);
  
  // Calculate progress percentage for visualization
  // Invert the percentage so lower deviation = higher progress
  const progressPercentage = Math.max(0, Math.min(100, 100 - (results.percentageDeviation * 6.25)));
  
  return (
    <TabsContent value="summary">
      <div className="space-y-4 py-2">
        <h3 className="font-medium text-white">Results ({results.sampleCount} samples)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-300">Mean Absolute Error</div>
              <Badge variant="outline" className="text-white">{results.mae.toFixed(2)} cm</Badge>
            </div>
            <div className="text-lg font-semibold text-white flex items-center gap-2">
              {results.mae.toFixed(2)} cm
              {results.mae <= 2 && <span className="text-xs text-green-400">High Precision</span>}
            </div>
            <Progress value={Math.max(0, 100 - (results.mae * 10))} className="h-2 mt-2" />
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-300">Percentage Deviation</div>
              <Badge className={accuracyLevel.color}>{accuracyLevel.label}</Badge>
            </div>
            <div className="text-lg font-semibold text-white flex items-center gap-2">
              {results.percentageDeviation.toFixed(2)}%
              <span className="text-xs text-gray-400">(Lower is better)</span>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 mt-2">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Key Measurement Insights</h4>
          <div className="space-y-2">
            <div className="text-sm text-white">
              {results.percentageDeviation <= 3 ? (
                <>Model accuracy exceeds professional tailoring standards (<3% deviation)</>
              ) : results.percentageDeviation <= 5 ? (
                <>Accuracy comparable to professional measurement standards (<5% deviation)</>
              ) : results.percentageDeviation <= 8 ? (
                <>Acceptable accuracy for general sizing guidance (<8% deviation)</>
              ) : (
                <>Requires calibration for improved accuracy ({results.percentageDeviation.toFixed(1)}% deviation)</>
              )}
            </div>
            
            {results.keyMeasurements && results.keyMeasurements.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Highest variance in: {results.keyMeasurements[0].name} ({results.keyMeasurements[0].deviation.toFixed(1)}%)
              </div>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
