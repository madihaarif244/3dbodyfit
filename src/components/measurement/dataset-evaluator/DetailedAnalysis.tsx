
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import type { EvaluationResults } from "./types";

interface DetailedAnalysisProps {
  results: EvaluationResults | null;
}

export default function DetailedAnalysis({ results }: DetailedAnalysisProps) {
  if (!results) return null;
  
  const getAccuracyLevel = (deviation: number) => {
    if (deviation <= 3) return "Excellent";
    if (deviation <= 6) return "Very Good";
    if (deviation <= 10) return "Good";
    if (deviation <= 15) return "Fair";
    return "Needs Improvement";
  };
  
  const overallAccuracy = getAccuracyLevel(results.percentageDeviation);
  const accuracyColor = {
    "Excellent": "text-green-500",
    "Very Good": "text-emerald-500",
    "Good": "text-blue-500",
    "Fair": "text-amber-500",
    "Needs Improvement": "text-red-500"
  }[overallAccuracy];
  
  // Prepare chart data with custom formatter for measurement names
  const chartData = results.keyMeasurements.map(item => ({
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    deviation: parseFloat(item.deviation.toFixed(1)),
    mae: parseFloat(item.mae.toFixed(1)),
    accuracyRating: getAccuracyLevel(item.deviation)
  }));
  
  return (
    <TabsContent value="detailed">
      <div className="space-y-4 py-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-white">Overall Accuracy</h3>
          <span className={`font-semibold ${accuracyColor}`}>{overallAccuracy}</span>
        </div>
        
        <div className="h-[350px] mb-6 p-4 bg-gray-800/70 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fill: '#E2E8F0' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fill: '#E2E8F0' }}
                label={{ 
                  value: 'Deviation %', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fill: '#E2E8F0'
                }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: '#E2E8F0' }}
                label={{ 
                  value: 'MAE (cm)', 
                  angle: 90, 
                  position: 'insideRight',
                  fill: '#E2E8F0' 
                }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px' }}
                formatter={(value: any, name: any) => {
                  return [value, name === "deviation" ? "% Deviation" : "MAE (cm)"];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
                formatter={(value) => value === "deviation" ? "% Deviation" : "MAE (cm)"}
              />
              <Bar yAxisId="left" dataKey="deviation" name="deviation" fill="#3b82f6">
                <LabelList dataKey="deviation" position="top" fill="#E2E8F0" fontSize={10} formatter={(v: any) => `${v}%`} />
              </Bar>
              <Bar yAxisId="right" dataKey="mae" name="mae" fill="#10b981">
                <LabelList dataKey="mae" position="top" fill="#E2E8F0" fontSize={10} formatter={(v: any) => `${v}`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <h3 className="font-medium text-white mb-2">Measurement Accuracy Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartData.map((item) => {
            const ratingColor = {
              "Excellent": "bg-green-500/20 border-green-500",
              "Very Good": "bg-emerald-500/20 border-emerald-500",
              "Good": "bg-blue-500/20 border-blue-500",
              "Fair": "bg-amber-500/20 border-amber-500",
              "Needs Improvement": "bg-red-500/20 border-red-500"
            }[item.accuracyRating];
            
            return (
              <Card key={item.name} className={`p-4 border ${ratingColor}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-sm text-gray-300">
                      {item.accuracyRating === "Needs Improvement" 
                        ? "Consider recalibrating this measurement" 
                        : item.accuracyRating === "Fair"
                        ? "Acceptable but could be improved"
                        : "Within acceptable accuracy range"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-white">{item.deviation}%</span>
                    <p className="text-xs text-gray-300">{item.mae} cm difference</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </TabsContent>
  );
}
