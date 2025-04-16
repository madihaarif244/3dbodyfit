
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

interface ResultsSummaryProps {
  results: {
    mae: number;
    percentageDeviation: number;
    sampleCount: number;
    keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
  } | null;
}

export default function ResultsSummary({ results }: ResultsSummaryProps) {
  if (!results) return null;
  
  return (
    <TabsContent value="summary">
      <div className="space-y-3 py-2">
        <h3 className="font-medium text-white">Results ({results.sampleCount} samples)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-300">Mean Absolute Error</div>
            <div className="text-lg font-semibold text-white">{results.mae.toFixed(2)} cm</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-300">Percentage Deviation</div>
            <div className="text-lg font-semibold text-white">{results.percentageDeviation.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
