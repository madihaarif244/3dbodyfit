
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
      <Card>
        <CardHeader>
          <CardTitle>Measurement Comparison</CardTitle>
          <CardDescription>
            Comparing your manual measurements with {isEstimated ? "estimated" : "AI-derived"} values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead>Measurement</TableHead>
                <TableHead className="text-right">Manual ({unit})</TableHead>
                <TableHead className="text-right">{isEstimated ? "Estimated" : "AI"} ({unit})</TableHead>
                <TableHead className="text-right">Difference ({unit})</TableHead>
                <TableHead className="text-right">Difference (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(manualMeasurements)
                .filter(key => key in aiMeasurements)
                .map(key => {
                  const manual = manualMeasurements[key];
                  const ai = aiMeasurements[key];
                  const diff = Math.abs(manual - ai);
                  const pctDiff = (diff / manual) * 100;
                  
                  return (
                    <TableRow key={key}>
                      <TableCell>{formatMeasurementName(key)}</TableCell>
                      <TableCell className="text-right">{formatNumber(manual, 1)}</TableCell>
                      <TableCell className="text-right">{formatNumber(ai, 1)}</TableCell>
                      <TableCell className="text-right">{formatNumber(diff, 1)}</TableCell>
                      <TableCell className="text-right">{formatNumber(pctDiff, 1)}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold mb-3">Measurement Difference Chart</h3>
          <div className="h-[400px] mb-8">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                />
                <YAxis yAxisId="left" orientation="left" label={{ value: unit, angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '%', angle: 90, position: 'insideRight' }} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar yAxisId="left" dataKey="manual" name="Manual" fill={chartConfig.manual.color} />
                <Bar yAxisId="left" dataKey="ai" name={isEstimated ? "Estimated" : "AI"} fill={chartConfig.ai.color} />
                <Bar yAxisId="left" dataKey="difference" name="Absolute Diff" fill={chartConfig.difference.color} />
                <Bar yAxisId="right" dataKey="percentDiff" name="% Diff" fill={chartConfig.percentDiff.color} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistical Analysis</CardTitle>
          <CardDescription>
            Key accuracy metrics for the {isEstimated ? "estimated" : "AI-derived"} measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-1">Mean Absolute Error</h3>
              <p className="text-2xl font-bold">{formatNumber(stats.mae.overall, 2)} {unit}</p>
              <p className="text-sm text-muted-foreground">
                Average absolute difference between measurements
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-1">Standard Deviation</h3>
              <p className="text-2xl font-bold">{formatNumber(stats.standardDeviation.overall, 2)} {unit}</p>
              <p className="text-sm text-muted-foreground">
                Consistency of measurement differences
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-1">Average Deviation</h3>
              <p className="text-2xl font-bold">{formatNumber(stats.percentageDeviation.overall, 2)}%</p>
              <p className="text-sm text-muted-foreground">
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
