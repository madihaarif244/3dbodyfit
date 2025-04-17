
import { TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { EvaluationResults } from "./DatasetEvaluator";

interface DetailedAnalysisProps {
  results: EvaluationResults | null;
}

export default function DetailedAnalysis({ results }: DetailedAnalysisProps) {
  if (!results) return null;
  
  return (
    <TabsContent value="detailed">
      <div className="space-y-4 py-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">Overall Accuracy</h3>
          <span className="font-semibold text-black dark:text-green-400">Excellent</span>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={results.keyMeasurements}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="name" 
              stroke="#000" 
              tick={{ fill: '#000' }} 
              axisLine={{ stroke: '#000' }}
            />
            <YAxis 
              stroke="#000" 
              tick={{ fill: '#000' }} 
              unit="%" 
              axisLine={{ stroke: '#000' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #000',
                color: '#000'
              }} 
              formatter={(value: any) => [`${value.toFixed(2)}%`, 'Deviation']}
            />
            <Legend 
              wrapperStyle={{ color: '#000' }}
              formatter={(value) => <span className="text-black">{value}</span>}
            />
            <Bar dataKey="deviation" name="% Deviation" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-1 gap-2 mt-4">
          {results.keyMeasurements.slice(0, 3).map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div>
                <span className="font-medium capitalize text-black dark:text-white">{item.name}</span>
                <p className="text-xs text-green-800 dark:text-green-300">
                  {item.deviation > 10 ? "Consider recalibrating this measurement" : "Within acceptable range"}
                </p>
              </div>
              <div className="text-right">
                <span className={item.deviation > 10 ? "text-red-800 dark:text-red-400" : "text-green-800 dark:text-green-400"}>
                  {item.deviation.toFixed(1)}% deviation
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-300">{item.mae.toFixed(1)} cm difference</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  );
}

