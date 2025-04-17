
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
      // This avoids artificially small percentages when the actual is smaller
      const minValue = Math.min(actual[key], predicted[key]);
      const maxValue = Math.max(actual[key], predicted[key]);
      
      // Calculate difference as percentage with improved formula
      // Using this approach to get a more meaningful error representation
      const diff = maxValue - minValue;
      const percentage = (diff / minValue) * 100;
      
      // Apply weight adjustments based on measurement importance
      let weight = 1.0;
      if (['chest', 'waist', 'hips'].includes(key)) {
        weight = 1.2; // Primary measurements are weighted more
      } else if (['shoulder', 'thigh'].includes(key)) {
        weight = 1.1; // Secondary important measurements
      } else if (['forearm', 'upperArm', 'calf'].includes(key)) {
        weight = 0.9; // Less critical measurements
      }
      
      const weightedPercentage = percentage * weight;
      
      totalPercentage += weightedPercentage;
      byMeasurement[key] = percentage; // Store unweighted for display
      count++;
    }
  }
  
  return {
    overall: count > 0 ? Math.min(totalPercentage / count, 60) : 0, // Cap at 60% to avoid extreme values
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
    .map(([key, value]) => ({ key, deviation: value }))
    .sort((a, b) => b.deviation - a.deviation)
    .slice(0, 3);
  
  // Calculate precision score (0-100)
  const precisionScore = Math.max(0, 100 - deviation.overall * 2);
  
  // Generate improvement recommendations
  const recommendations = problemMeasurements.map(item => {
    if (item.deviation > 15) {
      return `${item.key}: Significant deviation (${item.deviation.toFixed(1)}%) requires calibration`;
    } else if (item.deviation > 8) {
      return `${item.key}: Consider refinement (${item.deviation.toFixed(1)}%)`;
    }
    return `${item.key}: Acceptable accuracy (${item.deviation.toFixed(1)}%)`;
  });
  
  return {
    precisionScore,
    problemMeasurements,
    recommendations,
    overallMAE: mae.overall,
    overallDeviation: deviation.overall
  };
};
