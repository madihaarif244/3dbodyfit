
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
  
  // Improved dataset generation with more realistic human body measurements and correlations
  for (let i = 0; i < sampleSize; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    
    // More realistic height ranges by gender
    const height = gender === 'male' 
      ? 170 + Math.random() * 25 // Male height range ~170-195cm
      : 160 + Math.random() * 20; // Female height range ~160-180cm
      
    const measurements: Record<string, number> = {
      height
    };
    
    // Base anthropometric ratios - improved with research-based proportions
    const chestRatio = gender === 'male' ? 0.52 : 0.48;
    const waistRatio = gender === 'male' ? 0.45 : 0.40;
    const hipsRatio = gender === 'male' ? 0.51 : 0.53;
    
    // Apply body type variation (ectomorph, mesomorph, endomorph)
    const bodyType = Math.random(); // 0-0.33: ectomorph, 0.33-0.66: mesomorph, 0.66-1: endomorph
    
    // Calculate measurements with body type adjustments
    let chestAdjustment = 0;
    let waistAdjustment = 0;
    let hipsAdjustment = 0;
    
    if (bodyType < 0.33) { // Ectomorph - slimmer
      chestAdjustment = -0.02;
      waistAdjustment = -0.03;
      hipsAdjustment = -0.02;
    } else if (bodyType < 0.66) { // Mesomorph - muscular
      chestAdjustment = 0.03;
      waistAdjustment = -0.01;
      hipsAdjustment = 0.01;
    } else { // Endomorph - larger
      chestAdjustment = 0.04;
      waistAdjustment = 0.05;
      hipsAdjustment = 0.03;
    }
    
    // Apply more realistic variance - smaller for research-grade, larger for standard
    const varianceFactor = accuracyLevel === "research-grade" ? 0.02 : 
                          accuracyLevel === "high" ? 0.04 : 0.06;
    
    // Generate correlated measurements with appropriate variance
    measurements.chest = Math.round((height * (chestRatio + chestAdjustment) + 
      (Math.random() * 2 - 1) * varianceFactor * height) * 10) / 10;
    
    measurements.waist = Math.round((height * (waistRatio + waistAdjustment) + 
      (Math.random() * 2 - 1) * varianceFactor * height) * 10) / 10;
      
    measurements.hips = Math.round((height * (hipsRatio + hipsAdjustment) + 
      (Math.random() * 2 - 1) * varianceFactor * height) * 10) / 10;
      
    // Ensure realistic proportions between measurements
    // For males: typically chest > hips > waist
    // For females: typically hips > chest > waist
    if (gender === 'male') {
      if (measurements.chest < measurements.hips) {
        const avg = (measurements.chest + measurements.hips) / 2;
        measurements.chest = Math.round((avg * 1.05) * 10) / 10;
        measurements.hips = Math.round((avg * 0.95) * 10) / 10;
      }
    } else {
      if (measurements.hips < measurements.chest) {
        const avg = (measurements.chest + measurements.hips) / 2;
        measurements.hips = Math.round((avg * 1.05) * 10) / 10;
        measurements.chest = Math.round((avg * 0.95) * 10) / 10;
      }
    }
    
    // Add additional measurements with appropriate correlations
    measurements.shoulder = Math.round((height * (gender === 'male' ? 0.25 : 0.23) + 
      (Math.random() * 2 - 1) * varianceFactor * height * 0.8) * 10) / 10;
      
    measurements.inseam = Math.round((height * 0.45 + 
      (Math.random() * 2 - 1) * varianceFactor * height * 0.6) * 10) / 10;
      
    measurements.sleeve = Math.round((height * 0.35 + 
      (Math.random() * 2 - 1) * varianceFactor * height * 0.7) * 10) / 10;
    
    // Add optional measurements with higher quality data for higher accuracy levels
    if (accuracyLevel === "high" || accuracyLevel === "research-grade" || Math.random() > 0.2) {
      measurements.neck = Math.round((height * (gender === 'male' ? 0.22 : 0.19) + 
        (Math.random() * 2 - 1) * varianceFactor * height * 0.5) * 10) / 10;
        
      measurements.thigh = Math.round((measurements.hips * (gender === 'male' ? 0.6 : 0.63) + 
        (Math.random() * 2 - 1) * varianceFactor * height * 0.6) * 10) / 10;
        
      measurements.upperArm = Math.round((measurements.chest * (gender === 'male' ? 0.36 : 0.33) + 
        (Math.random() * 2 - 1) * varianceFactor * height * 0.4) * 10) / 10;
    }
    
    // Add more detailed measurements for higher accuracy levels
    if (accuracyLevel === "high" || accuracyLevel === "research-grade") {
      const precisionFactor = accuracyLevel === "research-grade" ? 0.5 : 1;
      
      measurements.forearm = Math.round((measurements.upperArm * 0.8 + 
        (Math.random() * 2 - 1) * varianceFactor * height * 0.3 * precisionFactor) * 10) / 10;
        
      measurements.calf = Math.round((measurements.thigh * 0.75 + 
        (Math.random() * 2 - 1) * varianceFactor * height * 0.3 * precisionFactor) * 10) / 10;
    }
    
    // Generate anthropometrically accurate landmarks
    const landmarks: Record<string, {x: number, y: number, z: number, visibility?: number}> = {};
    
    if (datasetType === '3dpw' || datasetType === 'caesar' || accuracyLevel === "research-grade") {
      const keypoints = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 
                        'rightKnee', 'leftAnkle', 'rightAnkle', 'neck', 'chest', 'waist'];
      
      // Height-normalized position of landmarks (y-axis)
      const landmarkYPositions: Record<string, number> = {
        neck: 0.15,
        leftShoulder: 0.18,
        rightShoulder: 0.18,
        chest: 0.25,
        waist: 0.40,
        leftHip: 0.49,
        rightHip: 0.49,
        leftKnee: 0.70,
        rightKnee: 0.70,
        leftAnkle: 0.95,
        rightAnkle: 0.95
      };
      
      // Width based on shoulder width and hip width
      const shoulderWidth = gender === 'male' ? 0.48 : 0.44;
      const hipWidth = gender === 'male' ? 0.38 : 0.42;
      
      keypoints.forEach(point => {
        const isLeft = point.startsWith('left');
        const isRight = point.startsWith('right');
        
        let x = 0.5; // Center by default
        if (point.includes('Shoulder')) {
          x = isLeft ? 0.5 - shoulderWidth/2 : 0.5 + shoulderWidth/2;
        } else if (point.includes('Hip')) {
          x = isLeft ? 0.5 - hipWidth/2 : 0.5 + hipWidth/2;
        } else if (point.includes('Knee')) {
          x = isLeft ? 0.45 : 0.55;
        } else if (point.includes('Ankle')) {
          x = isLeft ? 0.45 : 0.55;
        }
        
        const y = landmarkYPositions[point] || 0.5;
        
        // Add slight randomness
        const xNoise = (Math.random() * 2 - 1) * 0.01;
        const yNoise = (Math.random() * 2 - 1) * 0.01;
        
        landmarks[point] = {
          x: x + xNoise,
          y: y + yNoise,
          z: (Math.random() * 0.1 - 0.05), // Small z variance
          visibility: 0.9 + Math.random() * 0.1 // High visibility
        };
      });
    }
    
    // Calculate weight based on height and body type (BMI-based)
    let bmiBase = gender === 'male' ? 23 : 21.5;
    if (bodyType < 0.33) bmiBase -= 3; // Ectomorph
    else if (bodyType > 0.66) bmiBase += 4; // Endomorph
    
    const heightInM = height / 100;
    const weight = Math.round((bmiBase * heightInM * heightInM + (Math.random() * 6 - 3)) * 10) / 10;
    
    samples.push({
      id: `${datasetType}-${i}`,
      gender: gender as 'male' | 'female',
      age: 18 + Math.floor(Math.random() * 60),
      height,
      weight,
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
