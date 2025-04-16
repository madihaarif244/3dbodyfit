
import { TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";

interface DetailedAnalysisProps {
  results: {
    mae: number;
    percentageDeviation: number;
    sampleCount: number;
    keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
  } | null;
}

export default function DetailedAnalysis({ results }: DetailedAnalysisProps) {
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
    <TabsContent value="detailed">
      <div className="space-y-4 py-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-white">Overall Accuracy</h3>
          <span className={`font-semibold ${accuracyColor}`}>{overallAccuracy}</span>
        </div>
        
        <MeasurementChart measurements={results.keyMeasurements} />
        
        <MeasurementList measurements={results.keyMeasurements.slice(0, 3)} />
      </div>
    </TabsContent>
  );
}

function MeasurementChart({ measurements }: { measurements: Array<{name: string; deviation: number; mae: number}> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={measurements}>
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
  );
}

function MeasurementList({ measurements }: { measurements: Array<{name: string; deviation: number; mae: number}> }) {
  return (
    <div className="grid grid-cols-1 gap-2 mt-4">
      {measurements.map((item) => (
        <div key={item.name} className="flex justify-between items-center">
          <div>
            <span className="font-medium capitalize text-white">{item.name}</span>
            <p className="text-xs text-gray-300">
              {item.deviation > 10 ? "Consider recalibrating this measurement" : "Within acceptable range"}
            </p>
          </div>
          <div className="text-right">
            <span className={item.deviation > 10 ? "text-red-400" : "text-green-400"}>
              {item.deviation.toFixed(1)}% deviation
            </span>
            <p className="text-xs text-gray-300">{item.mae.toFixed(1)} cm difference</p>
          </div>
        </div>
      ))}
    </div>
  );
}
