
// Dataset interfaces
export interface DatasetSample {
  id: string;
  gender: 'male' | 'female' | 'other';
  age?: number;
  height?: number;
  weight?: number;
  measurements: Record<string, number>;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
  meshData?: any; // For 3D mesh data if available
}

export interface Dataset {
  name: string;
  description: string;
  sampleCount: number;
  samples: DatasetSample[];
}

// Mock implementation of dataset loading
// In a real application, this would fetch from an API or load local files
export const loadDataset = async (
  datasetType: string, 
  sampleSize: number
): Promise<Dataset> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create mock datasets based on requested type
  const samples: DatasetSample[] = [];
  
  const measurementTypes = [
    'chest', 'waist', 'hips', 'shoulder', 'inseam', 'sleeve',
    'neck', 'thigh', 'upperArm', 'forearm', 'calf'
  ];
  
  // Generate mock samples based on realistic human body measurements
  for (let i = 0; i < sampleSize; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const height = gender === 'male' 
      ? 170 + Math.random() * 25 // Male height range ~170-195cm
      : 160 + Math.random() * 20; // Female height range ~160-180cm
      
    const measurements: Record<string, number> = {
      height
    };
    
    // Generate realistic measurements based on height and gender
    measurements.chest = gender === 'male' 
      ? height * 0.52 + Math.random() * 10 - 5 
      : height * 0.48 + Math.random() * 10 - 5;
    
    measurements.waist = gender === 'male' 
      ? height * 0.45 + Math.random() * 8 - 4
      : height * 0.40 + Math.random() * 8 - 4;
      
    measurements.hips = gender === 'male' 
      ? height * 0.51 + Math.random() * 8 - 4
      : height * 0.53 + Math.random() * 8 - 4;
      
    measurements.shoulder = gender === 'male' 
      ? height * 0.25 + Math.random() * 5 - 2.5
      : height * 0.23 + Math.random() * 5 - 2.5;
      
    measurements.inseam = height * 0.45 + Math.random() * 5 - 2.5;
    measurements.sleeve = height * 0.35 + Math.random() * 4 - 2;
    
    // Add optional measurements
    if (Math.random() > 0.3) {
      measurements.neck = gender === 'male' 
        ? height * 0.22 + Math.random() * 3 - 1.5
        : height * 0.19 + Math.random() * 3 - 1.5;
    }
    
    if (Math.random() > 0.3) {
      measurements.thigh = gender === 'male' 
        ? height * 0.32 + Math.random() * 5 - 2.5
        : height * 0.31 + Math.random() * 5 - 2.5;
    }
    
    if (Math.random() > 0.3) {
      measurements.upperArm = gender === 'male' 
        ? height * 0.18 + Math.random() * 3 - 1.5
        : height * 0.16 + Math.random() * 3 - 1.5;
    }
    
    // Generate simple landmarks
    const landmarks: Record<string, {x: number, y: number, z: number, visibility?: number}> = {};
    
    if (datasetType === '3dpw' || datasetType === 'caesar') {
      const keypoints = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'];
      
      keypoints.forEach(point => {
        landmarks[point] = {
          x: Math.random() * 2 - 1, // Normalized -1 to 1
          y: Math.random() * 2 - 1,
          z: Math.random() * 0.5 - 0.25,
          visibility: Math.random() * 0.3 + 0.7 // 0.7-1.0 visibility
        };
      });
    }
    
    samples.push({
      id: `${datasetType}-${i}`,
      gender: gender as 'male' | 'female',
      age: 18 + Math.floor(Math.random() * 60),
      height,
      weight: gender === 'male' 
        ? height * 0.4 + Math.random() * 20 - 10
        : height * 0.35 + Math.random() * 20 - 10,
      measurements,
      landmarks: Object.keys(landmarks).length > 0 ? landmarks : undefined
    });
  }
  
  const datasetDescriptions: Record<string, string> = {
    caesar: "Civilian American and European Surface Anthropometry Resource - 3D scans and measurements from 4,400 subjects",
    renderpeople: "High-quality synthetic 3D human models with accurate measurements",
    "3dpw": "3D Poses in the Wild - Dataset with real-world images and corresponding 3D human pose & shape"
  };
  
  return {
    name: datasetType.toUpperCase(),
    description: datasetDescriptions[datasetType] || "Unknown dataset",
    sampleCount: samples.length,
    samples: samples
  };
};

// Utility to export results for later training
export const exportEvaluationResults = (
  datasetType: string,
  aiMeasurements: Record<string, number>,
  datasetMeasurements: Record<string, DatasetSample>
) => {
  const resultsObj = {
    timestamp: new Date().toISOString(),
    datasetType,
    aiMeasurements,
    datasetSamples: Object.values(datasetMeasurements),
  };
  
  // In a real app, this would send to server or download a JSON file
  const resultsJson = JSON.stringify(resultsObj, null, 2);
  console.log("Evaluation results exported:", resultsJson);
  
  // For browser downloading
  const blob = new Blob([resultsJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${datasetType}-evaluation-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  return resultsJson;
};
