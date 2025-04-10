
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { 
  calculateAllStats, 
  formatNumber, 
  generateComparisonChartData,
  formatMeasurementName
} from '@/utils/measurementStats';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface MeasurementComparisonProps {
  manualMeasurements: Record<string, number>;
  aiMeasurements: Record<string, number>;
  measurementSystem: 'metric' | 'imperial';
  isEstimated: boolean;
}

const MeasurementComparison: React.FC<MeasurementComparisonProps> = ({
  manualMeasurements,
  aiMeasurements,
  measurementSystem,
  isEstimated
}) => {
  // Calculate statistics
  const stats = useMemo(() => 
    calculateAllStats(manualMeasurements, aiMeasurements),
    [manualMeasurements, aiMeasurements]
  );
  
  // Prepare chart data
  const chartData = useMemo(() => 
    generateComparisonChartData(manualMeasurements, aiMeasurements),
    [manualMeasurements, aiMeasurements]
  );

  // Chart color config
  const chartConfig = {
    manual: { 
      label: "Manual", 
      color: "#9b87f5"  // Primary Purple
    },
    ai: { 
      label: "AI-Generated", 
      color: "#7E69AB" // Secondary Purple
    },
    difference: { 
      label: "Difference", 
      color: "#F97316" // Bright Orange
    },
    percentDiff: { 
      label: "% Difference", 
      color: "#D946EF" // Magenta Pink 
    }
  };
  
  // Display unit based on measurement system
  const unit = measurementSystem === 'metric' ? 'cm' : 'in';
  
  return (
    <div className="space-y-6">
      <Card className="bg-blue-950 border-blue-800">
        <CardHeader className="border-b border-blue-800">
          <CardTitle className="text-white text-xl">Measurement Comparison</CardTitle>
          <CardDescription className="text-blue-300">
            Comparing your manual measurements with {isEstimated ? "estimated" : "AI-derived"} values
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table className="mb-6">
              <TableHeader className="bg-blue-900">
                <TableRow className="border-blue-700">
                  <TableHead className="text-blue-100 font-bold">Measurement</TableHead>
                  <TableHead className="text-right text-blue-100 font-bold">Manual ({unit})</TableHead>
                  <TableHead className="text-right text-blue-100 font-bold">{isEstimated ? "Estimated" : "AI"} ({unit})</TableHead>
                  <TableHead className="text-right text-blue-100 font-bold">Difference ({unit})</TableHead>
                  <TableHead className="text-right text-blue-100 font-bold">Difference (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(manualMeasurements)
                  .filter(key => key in aiMeasurements && key !== 'height')
                  .map(key => {
                    const manual = manualMeasurements[key];
                    const ai = aiMeasurements[key];
                    const diff = Math.abs(manual - ai);
                    const pctDiff = (diff / manual) * 100;
                    
                    return (
                      <TableRow key={key} className="border-blue-800 hover:bg-blue-900/50">
                        <TableCell className="font-medium text-blue-100">{formatMeasurementName(key)}</TableCell>
                        <TableCell className="text-right text-blue-100">{formatNumber(manual, 1)}</TableCell>
                        <TableCell className="text-right text-blue-100">{formatNumber(ai, 1)}</TableCell>
                        <TableCell className="text-right text-blue-100">{formatNumber(diff, 1)}</TableCell>
                        <TableCell className="text-right text-blue-100">{formatNumber(pctDiff, 1)}%</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 text-white">Measurement Difference Chart</h3>
          <div className="h-[400px] mb-8 p-4 bg-blue-900/40 rounded-lg">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
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
                      value: unit, 
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
                      value: '%', 
                      angle: 90, 
                      position: 'insideRight',
                      fill: '#E2E8F0' 
                    }} 
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Bar yAxisId="left" dataKey="manual" name="Manual" fill={chartConfig.manual.color}>
                    <LabelList dataKey="manual" position="top" fill="#E2E8F0" fontSize={10} />
                  </Bar>
                  <Bar yAxisId="left" dataKey="ai" name={isEstimated ? "Estimated" : "AI"} fill={chartConfig.ai.color}>
                    <LabelList dataKey="ai" position="top" fill="#E2E8F0" fontSize={10} />
                  </Bar>
                  <Bar yAxisId="left" dataKey="difference" name="Absolute Diff" fill={chartConfig.difference.color}>
                    <LabelList dataKey="difference" position="top" fill="#E2E8F0" fontSize={10} />
                  </Bar>
                  <Bar yAxisId="right" dataKey="percentDiff" name="% Diff" fill={chartConfig.percentDiff.color}>
                    <LabelList dataKey="percentDiff" position="top" fill="#E2E8F0" fontSize={10} formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-950 border-blue-800">
        <CardHeader className="border-b border-blue-800">
          <CardTitle className="text-white text-xl">Statistical Analysis</CardTitle>
          <CardDescription className="text-blue-300">
            Key accuracy metrics for the {isEstimated ? "estimated" : "AI-derived"} measurements
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
              <h3 className="font-semibold text-lg mb-1 text-blue-100">Mean Absolute Error</h3>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.mae.overall, 2)} {unit}</p>
              <p className="text-sm text-blue-300">
                Average absolute difference between measurements
              </p>
            </div>
            
            <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
              <h3 className="font-semibold text-lg mb-1 text-blue-100">Standard Deviation</h3>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.standardDeviation.overall, 2)} {unit}</p>
              <p className="text-sm text-blue-300">
                Consistency of measurement differences
              </p>
            </div>
            
            <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
              <h3 className="font-semibold text-lg mb-1 text-blue-100">Average Deviation</h3>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.percentageDeviation.overall, 2)}%</p>
              <p className="text-sm text-blue-300">
                Average percentage difference
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeasurementComparison;
