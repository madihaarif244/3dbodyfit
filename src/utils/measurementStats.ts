
// Utility for calculating measurement accuracy statistics

/**
 * Calculate Mean Absolute Error between manual and AI measurements
 * @param manual Manual measurements entered by user
 * @param ai AI-generated measurements
 */
export const calculateMAE = (
  manual: Record<string, number>,
  ai: Record<string, number>
): { overall: number; byMeasurement: Record<string, number> } => {
  const keys = Object.keys(manual).filter(key => key in ai);
  
  if (keys.length === 0) {
    return { overall: 0, byMeasurement: {} };
  }
  
  // Apply measurement-specific weighting - some measurements are more important than others
  const weightings: Record<string, number> = {
    chest: 1.2,
    waist: 1.2,
    hips: 1.2,
    shoulder: 1.1,
    inseam: 1.0,
    sleeve: 1.0,
    neck: 0.9,
    thigh: 0.9,
    upperArm: 0.8,
    forearm: 0.7,
    calf: 0.7,
    // Add any other measurement types as needed
    default: 1.0
  };
  
  let totalWeightedError = 0;
  let totalWeight = 0;
  const byMeasurement: Record<string, number> = {};
  
  keys.forEach(key => {
    const error = Math.abs(manual[key] - ai[key]);
    byMeasurement[key] = error;
    
    // Apply weighting factor
    const weight = weightings[key] || weightings.default;
    totalWeightedError += error * weight;
    totalWeight += weight;
  });
  
  const overall = totalWeight > 0 ? totalWeightedError / totalWeight : 0;
  
  return { overall, byMeasurement };
};

/**
 * Calculate percentage deviation between manual and AI measurements
 * @param manual Manual measurements entered by user
 * @param ai AI-generated measurements
 */
export const calculatePercentageDeviation = (
  manual: Record<string, number>,
  ai: Record<string, number>
): { overall: number; byMeasurement: Record<string, number> } => {
  const keys = Object.keys(manual).filter(key => key in ai);
  
  if (keys.length === 0) {
    return { overall: 0, byMeasurement: {} };
  }
  
  // Apply measurement-specific weighting - same as for MAE
  const weightings: Record<string, number> = {
    chest: 1.2,
    waist: 1.2,
    hips: 1.2,
    shoulder: 1.1,
    inseam: 1.0,
    sleeve: 1.0,
    neck: 0.9,
    thigh: 0.9,
    upperArm: 0.8,
    forearm: 0.7,
    calf: 0.7,
    default: 1.0
  };
  
  let totalWeightedPercentage = 0;
  let totalWeight = 0;
  const byMeasurement: Record<string, number> = {};
  
  keys.forEach(key => {
    // Handle edge case to prevent division by zero
    if (manual[key] === 0) {
      byMeasurement[key] = ai[key] === 0 ? 0 : 100; // 100% error if manual is 0 but AI isn't
      return;
    }
    
    const percentage = Math.abs((manual[key] - ai[key]) / manual[key]) * 100;
    byMeasurement[key] = percentage;
    
    // Apply weighting factor
    const weight = weightings[key] || weightings.default;
    totalWeightedPercentage += percentage * weight;
    totalWeight += weight;
  });
  
  const overall = totalWeight > 0 ? totalWeightedPercentage / totalWeight : 0;
  
  return { overall, byMeasurement };
};

/**
 * Calculate standard deviation of errors
 * @param manual Manual measurements entered by user
 * @param ai AI-generated measurements
 */
export const calculateStandardDeviation = (
  manual: Record<string, number>,
  ai: Record<string, number>
): { overall: number; byMeasurement: Record<string, number> } => {
  const keys = Object.keys(manual).filter(key => key in ai);
  
  if (keys.length === 0) {
    return { overall: 0, byMeasurement: {} };
  }
  
  const errors = keys.map(key => manual[key] - ai[key]);
  const mean = errors.reduce((sum, err) => sum + err, 0) / errors.length;
  const squaredDifferences = errors.map(err => Math.pow(err - mean, 2));
  const overall = Math.sqrt(squaredDifferences.reduce((sum, sq) => sum + sq, 0) / errors.length);
  
  const byMeasurement: Record<string, number> = {};
  keys.forEach(key => {
    // For individual measurements, we report the absolute error since std dev doesn't apply to single points
    byMeasurement[key] = Math.abs(manual[key] - ai[key]);
  });
  
  return { overall, byMeasurement };
};

/**
 * Format a number to display with appropriate precision
 */
export const formatNumber = (num: number, precision: number = 2): string => {
  return num.toFixed(precision);
};

/**
 * Calculate all statistics at once
 */
export const calculateAllStats = (
  manual: Record<string, number>,
  ai: Record<string, number>
) => {
  return {
    mae: calculateMAE(manual, ai),
    percentageDeviation: calculatePercentageDeviation(manual, ai),
    standardDeviation: calculateStandardDeviation(manual, ai)
  };
};

/**
 * Generate chart data from measurement comparisons
 */
export const generateComparisonChartData = (
  manual: Record<string, number>,
  ai: Record<string, number>
) => {
  const keys = Object.keys(manual).filter(key => key in ai && key !== "height");
  
  return keys.map(key => ({
    name: formatMeasurementName(key),
    manual: manual[key],
    ai: ai[key],
    difference: Math.abs(manual[key] - ai[key]),
    percentDiff: Math.abs((manual[key] - ai[key]) / manual[key]) * 100
  }));
};

/**
 * Format measurement name for display
 */
export const formatMeasurementName = (key: string): string => {
  const capitalizeFirst = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1);
  
  // Handle special cases
  switch (key) {
    case 'upperArm':
      return 'Upper Arm';
    case 'forearm':
      return 'Forearm';
    default:
      return capitalizeFirst(key);
  }
};

/**
 * Calculate the confidence interval for a measurement
 * @param value The measurement value
 * @param confidenceLevel The confidence level (0-1)
 * @param measurementType The type of measurement
 */
export const calculateConfidenceInterval = (
  value: number,
  confidenceLevel: number = 0.95,
  measurementType: string
): [number, number] => {
  // Standard error estimates by measurement type (as percentage of measurement)
  const standardErrors: Record<string, number> = {
    chest: 0.025,
    waist: 0.03,
    hips: 0.025,
    shoulder: 0.035,
    inseam: 0.02,
    sleeve: 0.025,
    neck: 0.03,
    thigh: 0.04,
    upperArm: 0.045,
    forearm: 0.05,
    calf: 0.045,
    default: 0.035
  };
  
  const standardError = (standardErrors[measurementType] || standardErrors.default) * value;
  
  // Z-score for 95% confidence is ~1.96
  const zScore = confidenceLevel === 0.99 ? 2.58 :
                confidenceLevel === 0.95 ? 1.96 :
                confidenceLevel === 0.90 ? 1.64 : 1.96;
  
  const marginOfError = standardError * zScore;
  
  return [value - marginOfError, value + marginOfError];
};
