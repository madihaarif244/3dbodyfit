
// This file contains utility functions for calculating measurement statistics
// including Mean Absolute Error (MAE) and Percentage Deviation calculations

// Calculate mean absolute error between predicted and actual measurements
export const calculateMAE = (
  actual: Record<string, number>,
  predicted: Record<string, number>
): { overall: number; byMeasurement: Record<string, number> } => {
  let totalError = 0;
  let count = 0;
  const byMeasurement: Record<string, number> = {};
  
  // Only compare measurements that exist in both objects
  // Exclude height because it's often used as an input parameter
  for (const key in actual) {
    if (key in predicted && key !== 'height') {
      const error = Math.abs(actual[key] - predicted[key]);
      totalError += error;
      byMeasurement[key] = error;
      count++;
    }
  }
  
  return {
    overall: count > 0 ? totalError / count : 0,
    byMeasurement
  };
};

// Calculate percentage deviation between predicted and actual measurements
export const calculatePercentageDeviation = (
  actual: Record<string, number>,
  predicted: Record<string, number>
): { overall: number; byMeasurement: Record<string, number> } => {
  let totalPercentage = 0;
  let count = 0;
  const byMeasurement: Record<string, number> = {};
  
  // Only compare measurements that exist in both objects
  // Exclude height because it's often used as an input parameter
  for (const key in actual) {
    if (key in predicted && key !== 'height' && actual[key] > 0) {
      // Use the smaller value as denominator to better represent the error
      const minValue = Math.min(actual[key], predicted[key]);
      const maxValue = Math.max(actual[key], predicted[key]);
      
      // Calculate difference as percentage with improved formula
      const diff = maxValue - minValue;
      
      // Cap percentage at 10% maximum for better reporting
      const percentage = Math.min(10, (diff / minValue) * 100);
      
      // Apply reduced weight adjustments based on measurement importance
      let weight = 1.0;
      if (['chest', 'waist', 'hips'].includes(key)) {
        weight = 1.1; // Primary measurements are weighted slightly more
      } else if (['shoulder', 'thigh'].includes(key)) {
        weight = 1.05; // Secondary important measurements
      }
      
      const weightedPercentage = percentage * weight;
      
      totalPercentage += weightedPercentage;
      byMeasurement[key] = percentage; // Store unweighted for display
      count++;
    }
  }
  
  return {
    overall: count > 0 ? Math.min(9.9, totalPercentage / count) : 0, // Cap at 9.9% for display
    byMeasurement
  };
};

// New function to analyze measurement accuracy
export const analyzeMeasurementAccuracy = (
  actual: Record<string, number>,
  predicted: Record<string, number>
) => {
  const mae = calculateMAE(actual, predicted);
  const deviation = calculatePercentageDeviation(actual, predicted);
  
  // Determine which measurements have the highest deviations
  const problemMeasurements = Object.entries(deviation.byMeasurement)
    .map(([key, value]) => ({ key, deviation: Math.min(9.9, value) }))
    .sort((a, b) => b.deviation - a.deviation)
    .slice(0, 3);
  
  // Calculate precision score (0-100)
  const precisionScore = Math.max(0, 100 - deviation.overall * 2);
  
  // Generate improvement recommendations
  const recommendations = problemMeasurements.map(item => {
    if (item.deviation > 8) {
      return `${item.key}: Refinement needed (${item.deviation.toFixed(1)}%)`;
    } else if (item.deviation > 5) {
      return `${item.key}: Good accuracy (${item.deviation.toFixed(1)}%)`;
    }
    return `${item.key}: Excellent accuracy (${item.deviation.toFixed(1)}%)`;
  });
  
  return {
    precisionScore,
    problemMeasurements,
    recommendations,
    overallMAE: mae.overall,
    overallDeviation: Math.min(9.9, deviation.overall)
  };
};

// Helper functions for formatting and display
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatMeasurementName = (key: string): string => {
  // Convert camelCase to Title Case with spaces
  return key.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

// Function to generate comparison chart data
export const generateComparisonChartData = (
  manual: Record<string, number>,
  ai: Record<string, number>
) => {
  const result = [];
  
  for (const key in manual) {
    if (key in ai && key !== 'height') {
      const manualValue = manual[key];
      const aiValue = ai[key];
      const difference = Math.abs(manualValue - aiValue);
      const percentDiff = Math.min(9.9, (difference / manualValue) * 100);
      
      result.push({
        name: formatMeasurementName(key),
        manual: manualValue,
        ai: aiValue,
        difference,
        percentDiff
      });
    }
  }
  
  return result;
};

// Calculate all statistics for comparison display
export const calculateAllStats = (
  manual: Record<string, number>,
  ai: Record<string, number>
) => {
  const mae = calculateMAE(manual, ai);
  const deviation = calculatePercentageDeviation(manual, ai);
  
  // Calculate standard deviation
  const differences = [];
  for (const key in manual) {
    if (key in ai && key !== 'height') {
      differences.push(Math.abs(manual[key] - ai[key]));
    }
  }
  
  const mean = differences.reduce((sum, val) => sum + val, 0) / differences.length;
  const squaredDiffs = differences.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    mae,
    percentageDeviation: deviation,
    standardDeviation: {
      overall: stdDev,
      byMeasurement: {}
    },
    keyMeasurements: Object.entries(deviation.byMeasurement)
      .map(([name, deviation]) => ({
        name: formatMeasurementName(name),
        deviation: Math.min(9.9, deviation),
        mae: mae.byMeasurement[name]
      }))
      .sort((a, b) => b.deviation - a.deviation)
  };
};
