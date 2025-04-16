
/**
 * Utility functions for exporting data
 */

import { EvaluationResults } from "@/components/measurement/dataset-evaluator/DatasetEvaluator";

/**
 * Convert data to CSV format and trigger download
 */
export const exportToCSV = (
  data: any[], 
  filename: string = 'export.csv'
): void => {
  // Convert data to CSV string
  const csvRows: string[] = [];
  
  // Get headers (column names)
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that need quotes (strings with commas, etc.)
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format dataset evaluation results for CSV export
 */
export const formatEvaluationResultsForExport = (
  results: EvaluationResults,
  datasetType: string = "3dpw"
): any[] => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Create a row for summary data
  const summaryData = {
    category: 'Summary',
    name: 'Overall Results',
    value: '',
    meanAbsoluteError: results.mae.toFixed(2),
    percentageDeviation: results.percentageDeviation.toFixed(2),
    sampleCount: results.sampleCount,
    datasetType: "3DPW",
    exportDate: currentDate
  };
  
  // Create rows for each measurement
  const measurementRows = results.keyMeasurements.map(measurement => ({
    category: 'Measurement',
    name: measurement.name,
    value: '',
    meanAbsoluteError: measurement.mae.toFixed(2),
    percentageDeviation: measurement.deviation.toFixed(2),
    sampleCount: results.sampleCount,
    datasetType: "3DPW",
    exportDate: currentDate
  }));
  
  // Combine all rows
  return [summaryData, ...measurementRows];
};
