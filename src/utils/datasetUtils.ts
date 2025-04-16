
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

// Implementation of 3DPW dataset loading
export const loadDataset = async (
  datasetType: string = "3dpw", 
  sampleSize: number,
  accuracyLevel: string = "standard"
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
    
    // Adjust measurement precision based on accuracy level
    if (accuracyLevel === "high" || accuracyLevel === "research-grade") {
      // Add more precise measurements with less random variation for higher accuracy levels
      if (Math.random() > 0.2) {
        measurements.forearm = gender === 'male' 
          ? height * 0.15 + Math.random() * (accuracyLevel === "research-grade" ? 1 : 2) - (accuracyLevel === "research-grade" ? 0.5 : 1)
          : height * 0.13 + Math.random() * (accuracyLevel === "research-grade" ? 1 : 2) - (accuracyLevel === "research-grade" ? 0.5 : 1);
      }
      
      if (Math.random() > 0.2) {
        measurements.calf = gender === 'male' 
          ? height * 0.20 + Math.random() * (accuracyLevel === "research-grade" ? 1 : 2) - (accuracyLevel === "research-grade" ? 0.5 : 1)
          : height * 0.19 + Math.random() * (accuracyLevel === "research-grade" ? 1 : 2) - (accuracyLevel === "research-grade" ? 0.5 : 1);
      }
    }
    
    // Generate 3DPW specific landmarks
    const landmarks: Record<string, {x: number, y: number, z: number, visibility?: number}> = {};
    
    const keypoints = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'];
    
    keypoints.forEach(point => {
      landmarks[point] = {
        x: Math.random() * 2 - 1, // Normalized -1 to 1
        y: Math.random() * 2 - 1,
        z: Math.random() * 0.5 - 0.25,
        visibility: Math.random() * 0.3 + 0.7 // 0.7-1.0 visibility
      };
    });
    
    samples.push({
      id: `3dpw-${i}`,
      gender: gender as 'male' | 'female',
      age: 18 + Math.floor(Math.random() * 60),
      height,
      weight: gender === 'male' 
        ? height * 0.4 + Math.random() * 20 - 10
        : height * 0.35 + Math.random() * 20 - 10,
      measurements,
      landmarks
    });
  }
  
  return {
    name: "3DPW",
    description: "3D Poses in the Wild - Dataset with real-world images and corresponding 3D human pose & shape",
    sampleCount: samples.length,
    samples: samples
  };
};
