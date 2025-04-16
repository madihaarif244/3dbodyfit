
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
  
  const errors = keys.map(key => Math.abs(manual[key] - ai[key]));
  const overall = errors.reduce((sum, err) => sum + err, 0) / errors.length;
  
  const byMeasurement: Record<string, number> = {};
  keys.forEach(key => {
    byMeasurement[key] = Math.abs(manual[key] - ai[key]);
  });
  
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
  
  const percentages = keys.map(key => Math.abs((manual[key] - ai[key]) / manual[key]) * 100);
  const overall = percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length;
  
  const byMeasurement: Record<string, number> = {};
  keys.forEach(key => {
    byMeasurement[key] = Math.abs((manual[key] - ai[key]) / manual[key]) * 100;
  });
  
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
    // For individual measurements, just report the absolute error as "std dev" doesn't apply to a single point
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
    
  return capitalizeFirst(key);
};
