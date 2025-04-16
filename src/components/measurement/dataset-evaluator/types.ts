
export interface EvaluationResults {
  mae: number;
  percentageDeviation: number;
  sampleCount: number;
  keyMeasurements: Array<{name: string; deviation: number; mae: number}>;
}
