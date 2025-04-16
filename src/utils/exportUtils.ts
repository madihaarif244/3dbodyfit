
// Utility functions for exporting measurement data

/**
 * Format evaluation results for export to CSV
 */
export const formatEvaluationResultsForExport = (
  results: {
    mae: number;
    percentageDeviation: number;
    sampleCount: number;
    keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
  },
  datasetType: string
) => {
  // Header row
  const header = ["Measurement", "Avg Deviation (%)", "MAE (cm)", "Accuracy Rating"];
  
  // Data rows
  const rows = results.keyMeasurements.map(item => {
    // Calculate accuracy rating
    const accuracyRating = getAccuracyRating(item.deviation);
    
    return [
      item.name,
      item.deviation.toFixed(2),
      item.mae.toFixed(2),
      accuracyRating
    ];
  });
  
  // Add summary row
  rows.push([
    "OVERALL",
    results.percentageDeviation.toFixed(2),
    results.mae.toFixed(2),
    getAccuracyRating(results.percentageDeviation)
  ]);
  
  // Add metadata
  const metadata = [
    ["Dataset", datasetType.toUpperCase()],
    ["Sample Count", results.sampleCount.toString()],
    ["Date", new Date().toISOString().split('T')[0]],
    ["", ""], // Empty row as separator
  ];
  
  return [...metadata, header, ...rows];
};

/**
 * Convert data array to CSV and download
 */
export const exportToCSV = (data: string[][], filename: string) => {
  // Format CSV content
  const csvContent = data.map(row => row.map(cell => {
    // Wrap in quotes if cell contains commas
    if (cell.includes(',')) {
      return `"${cell}"`;
    }
    return cell;
  }).join(",")).join("\n");
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Helper to get accuracy rating from deviation percentage
 */
const getAccuracyRating = (deviationPercentage: number): string => {
  if (deviationPercentage <= 3) return "Excellent";
  if (deviationPercentage <= 6) return "Very Good";
  if (deviationPercentage <= 10) return "Good";
  if (deviationPercentage <= 15) return "Fair";
  return "Needs Improvement";
};
