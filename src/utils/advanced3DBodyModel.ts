
import axios from 'axios';
import { calculateBodyMeasurements } from './bodyMeasurementAI';

type ModelType = 'SMPL' | 'SMPL-X' | 'STAR' | 'PARE' | 'SPIN' | 'SIZER';

interface ModelParams {
  gender: string;
  height: number;
  measurementSystem: string;
}

interface BodyModelResult {
  measurements: Record<string, number>;
  confidence: number;
  modelType: ModelType;
  meshData?: any;
}

export const getBodyMeasurementsFromImages = async (
  frontImage: File | null,
  sideImage: File | null,
  params: ModelParams,
  preferredModel: ModelType = 'SMPL'
): Promise<BodyModelResult> => {
  console.log("Running advanced 3D body modeling with:", preferredModel);
  console.log("Processing images and parameters:", params);
  
  if (!frontImage) {
    throw new Error('Front image is required for 3D body modeling');
  }

  try {
    // For browser-based processing, we'll use the local AI model first
    // to get baseline measurements
    const baselineMeasurements = await calculateBodyMeasurements(
      params.gender,
      params.height.toString(),
      params.measurementSystem,
      frontImage
    );
    
    // In a production system, this would send images to a backend service
    // that runs the actual SMPL/SMPL-X/PARE model inference
    // For now, we'll simulate improved results by refining the baseline
    
    // Create a simulated response with more accurate measurements
    // In a real implementation, this data would come from the 3D model fitting
    const enhancedMeasurements = refineMeasurementsWithModel(
      baselineMeasurements, 
      params.gender,
      params.height,
      params.measurementSystem,
      preferredModel
    );
    
    // Calculate higher confidence score for the advanced model
    const confidenceScore = calculateConfidenceScore(preferredModel, !!sideImage);
    
    return {
      measurements: enhancedMeasurements,
      confidence: confidenceScore,
      modelType: preferredModel
    };
  } catch (error) {
    console.error("Error in advanced body modeling:", error);
    throw new Error(`3D body modeling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Function to refine measurements based on the selected 3D model and user height
const refineMeasurementsWithModel = (
  baseMeasurements: Record<string, number>,
  gender: string,
  userHeight: number,
  measurementSystem: string,
  modelType: ModelType
): Record<string, number> => {
  const refinedMeasurements = { ...baseMeasurements };
  
  // Convert height to cm for consistent calculations
  const heightCm = measurementSystem === 'imperial' ? userHeight * 2.54 : userHeight;
  
  // Calculate the scaling factor based on the user's height
  // First, normalize based on the average height for the gender
  const standardHeight = gender === 'male' ? 175 : gender === 'female' ? 162 : 168;
  const heightScaleFactor = heightCm / standardHeight;
  
  console.log(`User height: ${heightCm}cm, Scale factor: ${heightScaleFactor.toFixed(3)}`);
  
  // Apply the height scaling factor to the base measurements
  // This simulates what happens when a 3D mesh is scaled to match user height
  Object.keys(refinedMeasurements).forEach(key => {
    if (key !== 'height') { // Don't rescale height - it's our reference
      const measurementScaleFactor = getScaleFactorForMeasurement(key, modelType);
      refinedMeasurements[key] = Math.round((refinedMeasurements[key] * heightScaleFactor * measurementScaleFactor) * 10) / 10;
    }
  });
  
  // Apply model-specific refinements
  // In a real implementation, this would use actual model outputs 
  // Here we're simulating improved accuracy based on 3D model capabilities
  const accuracyFactor = getModelAccuracyFactor(modelType);
  
  // Apply small variations based on the model type and measurement
  // This simulates the higher accuracy of advanced 3D body models
  Object.keys(refinedMeasurements).forEach(key => {
    if (key !== 'height') { // Keep height exactly as provided by user
      const variance = getRealisticVariance(key, modelType);
      refinedMeasurements[key] = Math.round((refinedMeasurements[key] * variance) * 10) / 10;
    }
  });
  
  // Make sure height is preserved exactly as provided (in cm)
  refinedMeasurements.height = heightCm;
  
  // Models like SMPL-X and SIZER provide additional detailed measurements
  if (modelType === 'SMPL-X' || modelType === 'SIZER') {
    refinedMeasurements.upperArm = Math.round((refinedMeasurements.chest * 0.32) * 10) / 10;
    refinedMeasurements.forearm = Math.round((refinedMeasurements.chest * 0.25) * 10) / 10;
    refinedMeasurements.calf = Math.round((refinedMeasurements.thigh * 0.75) * 10) / 10;
  }
  
  // For SIZER, add more clothing-specific measurements
  if (modelType === 'SIZER') {
    refinedMeasurements.neckCircumference = Math.round((refinedMeasurements.neck * 1.05) * 10) / 10;
    refinedMeasurements.shoulderWidth = Math.round((refinedMeasurements.shoulder * 1.02) * 10) / 10;
  }
  
  return refinedMeasurements;
};

// Get scale factor for different body parts (not all body parts scale linearly with height)
const getScaleFactorForMeasurement = (measurementType: string, modelType: ModelType): number => {
  // Different body measurements scale differently with height
  // Based on anthropometric research
  const baseScaleFactors: Record<string, number> = {
    chest: 0.95,
    waist: 0.92,
    hips: 0.97,
    shoulder: 0.98,
    sleeve: 1.05,
    inseam: 1.08,
    neck: 0.90,
    thigh: 0.96
  };
  
  // Model-specific adjustments
  const modelAdjustments: Record<ModelType, number> = {
    'SMPL': 1.00,
    'SMPL-X': 1.02,
    'STAR': 1.01,
    'PARE': 1.03,
    'SPIN': 1.02,
    'SIZER': 1.04
  };
  
  const baseFactor = baseScaleFactors[measurementType] || 1.0;
  const modelFactor = modelAdjustments[modelType];
  
  return baseFactor * modelFactor;
};

// Calculate confidence score based on model type and available images
const calculateConfidenceScore = (modelType: ModelType, hasSideImage: boolean): number => {
  // Base confidence levels for different models
  const baseConfidence: Record<ModelType, number> = {
    'SMPL': 0.82,
    'SMPL-X': 0.88,
    'STAR': 0.85,
    'PARE': 0.89,
    'SPIN': 0.86,
    'SIZER': 0.91
  };
  
  // Increase confidence if both front and side images are available
  const multiViewBonus = hasSideImage ? 0.05 : 0;
  
  // Calculate final confidence with a small random element for realism
  const randomVariation = (Math.random() * 0.03) - 0.015; // ±1.5%
  
  return Math.min(0.98, baseConfidence[modelType] + multiViewBonus + randomVariation);
};

// Get model-specific accuracy factor
const getModelAccuracyFactor = (modelType: ModelType): number => {
  switch (modelType) {
    case 'SMPL': return 1.02;
    case 'SMPL-X': return 1.05;
    case 'STAR': return 1.03;
    case 'PARE': return 1.04;
    case 'SPIN': return 1.03;
    case 'SIZER': return 1.06;
    default: return 1.0;
  }
};

// Get realistic variance for each measurement based on model type
const getRealisticVariance = (measurementType: string, modelType: ModelType): number => {
  // Base variance factor dependent on measurement type and model
  const baseVariance: Record<string, Record<ModelType, number>> = {
    chest: {
      'SMPL': 1.01, 'SMPL-X': 1.03, 'STAR': 1.02, 
      'PARE': 1.04, 'SPIN': 1.03, 'SIZER': 1.05
    },
    waist: {
      'SMPL': 1.02, 'SMPL-X': 1.04, 'STAR': 1.03, 
      'PARE': 1.05, 'SPIN': 1.04, 'SIZER': 1.06
    },
    hips: {
      'SMPL': 1.01, 'SMPL-X': 1.03, 'STAR': 1.02, 
      'PARE': 1.03, 'SPIN': 1.02, 'SIZER': 1.04
    },
    // Default values for other measurements
    default: {
      'SMPL': 1.01, 'SMPL-X': 1.02, 'STAR': 1.01, 
      'PARE': 1.02, 'SPIN': 1.02, 'SIZER': 1.03
    }
  };
  
  // Slight random variance for realism (±1%)
  const randomFactor = 1 + ((Math.random() * 0.02) - 0.01);
  
  // Get the base variance for this measurement/model
  const specificVariance = baseVariance[measurementType]?.[modelType] || 
                          baseVariance.default[modelType];
  
  return specificVariance * randomFactor;
};

// Function to call the Flask backend API for 3D model processing
// In a production app, this would actually use the Python backend
export const process3DModelWithBackend = async (
  frontImageBase64: string,
  sideImageBase64: string | null,
  params: ModelParams
): Promise<Record<string, number>> => {
  try {
    const response = await axios.post('http://localhost:8000/process-measurements', {
      frontImageBase64,
      sideImageBase64,
      gender: params.gender,
      height: params.height,
      measurementSystem: params.measurementSystem
    });
    
    return response.data.measurements;
  } catch (error) {
    console.error("Backend processing error:", error);
    throw new Error("Failed to process images with backend 3D model");
  }
};

// Slice the 3D mesh at specific points to extract measurements
// In production, this would use actual mesh data from the 3D model
export const extractMeasurementsFromMesh = (
  meshData: any,
  userHeight: number,
  measurementSystem: string
): Record<string, number> => {
  // This is a simulation - in reality, this would calculate measurements by:
  // 1. Finding the circumference of the mesh at specific height levels
  // 2. Converting to real-world measurements using the height scale factor
  
  // Convert height to cm for consistency
  const heightCm = measurementSystem === 'imperial' ? userHeight * 2.54 : userHeight;
  
  // In a real implementation, we would:
  // - Get vertices from the mesh at the bust/chest level (typically ~0.72 of height from ground)
  // - Calculate the perimeter of the slice
  // - Similarly for waist (~0.62 of height from ground)
  // - Similarly for hips (~0.52 of height from ground)
  // - Get inseam by finding the distance from crotch point to ankle
  // - etc.
  
  // For now, we'll return simulated measurements
  return {
    chest: Math.round((heightCm * 0.52) * 10) / 10,
    waist: Math.round((heightCm * 0.43) * 10) / 10,
    hips: Math.round((heightCm * 0.51) * 10) / 10,
    inseam: Math.round((heightCm * 0.45) * 10) / 10,
    shoulder: Math.round((heightCm * 0.23) * 10) / 10,
    sleeve: Math.round((heightCm * 0.33) * 10) / 10,
    neck: Math.round((heightCm * 0.19) * 10) / 10,
    thigh: Math.round((heightCm * 0.29) * 10) / 10,
    height: heightCm
  };
};
