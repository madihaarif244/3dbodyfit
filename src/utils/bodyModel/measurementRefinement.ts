import { ModelType } from '@/types/bodyMeasurement';

export const refineMeasurementsWithAdvancedAlgorithm = (
  baseMeasurements: Record<string, number>,
  gender: string,
  userHeight: number,
  measurementSystem: string,
  modelType: ModelType,
  hasSideImage: boolean = false
): Record<string, number> => {
  const refinedMeasurements = { ...baseMeasurements };
  
  const heightCm = measurementSystem === 'imperial' ? userHeight * 2.54 : userHeight;
  const standardHeight = gender === 'male' ? 175 : gender === 'female' ? 162 : 168;
  const heightScaleFactor = heightCm / standardHeight;
  
  console.log(`User height: ${heightCm}cm, Scale factor: ${heightScaleFactor.toFixed(3)}`);
  
  Object.keys(refinedMeasurements).forEach(key => {
    if (key !== 'height') {
      const measurementScaleFactor = getHighAccuracyScaleFactorForMeasurement(key, modelType, gender, heightScaleFactor);
      refinedMeasurements[key] = Math.round((refinedMeasurements[key] * heightScaleFactor * measurementScaleFactor) * 10) / 10;
    }
  });
  
  applyBiomechanicalConstraints(refinedMeasurements, gender, modelType);
  const accuracyFactor = getHighPrecisionModelAccuracyFactor(modelType, gender);
  
  // Apply measurements for upper body
  refinedMeasurements.upperArm = Math.round((refinedMeasurements.chest * getUpperArmRatio(gender, modelType) * accuracyFactor) * 10) / 10;
  refinedMeasurements.forearm = Math.round((refinedMeasurements.chest * getForearmRatio(gender, modelType) * accuracyFactor) * 10) / 10;
  refinedMeasurements.calf = Math.round((refinedMeasurements.thigh * getCalfRatio(gender, modelType) * accuracyFactor) * 10) / 10;
  
  if (modelType === 'SMPL-X' || modelType === 'SIZER') {
    refinedMeasurements.neckCircumference = Math.round((refinedMeasurements.neck * getNeckCircumferenceRatio(gender)) * 10) / 10;
    refinedMeasurements.shoulderWidth = Math.round((refinedMeasurements.shoulder * getShoulderWidthRatio(gender)) * 10) / 10;
  }
  
  refinedMeasurements.height = heightCm;
  
  return refinedMeasurements;
};

const getUpperArmRatio = (gender: string, modelType: ModelType): number => {
  const baseRatio = gender.toLowerCase() === 'male' ? 0.325 : 0.305;
  const modelAdjustment = modelType === 'SMPL-X' || modelType === 'SIZER' ? 1.02 : 1.0;
  return baseRatio * modelAdjustment;
};

const getForearmRatio = (gender: string, modelType: ModelType): number => {
  const baseRatio = gender.toLowerCase() === 'male' ? 0.265 : 0.245;
  const modelAdjustment = modelType === 'SMPL-X' || modelType === 'SIZER' ? 1.02 : 1.0;
  return baseRatio * modelAdjustment;
};

const getCalfRatio = (gender: string, modelType: ModelType): number => {
  const baseRatio = gender.toLowerCase() === 'male' ? 0.74 : 0.715;
  const modelAdjustment = modelType === 'SMPL-X' || modelType === 'SIZER' ? 1.02 : 1.0;
  return baseRatio * modelAdjustment;
};

const getNeckCircumferenceRatio = (gender: string): number => {
  return gender.toLowerCase() === 'male' ? 1.12 : 1.10;
};

const getShoulderWidthRatio = (gender: string): number => {
  return gender.toLowerCase() === 'male' ? 1.05 : 1.04;
};

export const getHighAccuracyScaleFactorForMeasurement = (
  measurementType: string, 
  modelType: ModelType, 
  gender: string,
  heightScaleFactor: number
): number => {
  const maleScaleFactors: Record<string, number> = {
    chest: 1.015,
    waist: 0.98,
    hips: 0.99,
    shoulder: 1.025,
    sleeve: 1.03,
    inseam: 1.02,
    neck: 0.97,
    thigh: 0.985
  };
  
  const femaleScaleFactors: Record<string, number> = {
    chest: 0.99,
    waist: 0.95,
    hips: 1.025,
    shoulder: 0.98,
    sleeve: 1.02,
    inseam: 1.03,
    neck: 0.93,
    thigh: 0.995
  };
  
  const baseScaleFactors = gender.toLowerCase() === 'female' ? femaleScaleFactors : maleScaleFactors;
  
  const modelAdjustments: Record<ModelType, number> = {
    'SMPL': 1.00,
    'SMPL-X': 1.04,
    'STAR': 1.02,
    'PARE': 1.03,
    'SPIN': 1.02,
    'SIZER': 1.05
  };
  
  const baseFactor = baseScaleFactors[measurementType] || 1.0;
  const modelFactor = modelAdjustments[modelType];
  
  const heightAdjustment = heightScaleFactor > 1.05 ? 1.01 : heightScaleFactor < 0.95 ? 0.99 : 1.00;
  
  const naturalVariation = 1 + ((Math.random() - 0.5) * 0.01);
  
  return baseFactor * modelFactor * heightAdjustment * naturalVariation;
};

export const applyBiomechanicalConstraints = (
  measurements: Record<string, number>,
  gender: string,
  modelType: ModelType
): void => {
  const isMale = gender.toLowerCase() === 'male';
  
  const constraints = {
    chest_to_waist_min: isMale ? 1.12 : 1.08,
    chest_to_waist_max: isMale ? 1.28 : 1.22,
    hips_to_waist_min: isMale ? 1.05 : 1.1,
    hips_to_waist_max: isMale ? 1.18 : 1.28,
    shoulder_to_chest_min: isMale ? 0.43 : 0.40,
    shoulder_to_chest_max: isMale ? 0.48 : 0.45,
    thigh_to_hips_min: isMale ? 0.52 : 0.55,
    thigh_to_hips_max: isMale ? 0.62 : 0.64
  };
  
  if (measurements.chest && measurements.waist) {
    const chestToWaist = measurements.chest / measurements.waist;
    
    if (chestToWaist < constraints.chest_to_waist_min) {
      const avgValue = (measurements.chest * 0.6 + measurements.waist * 0.4);
      measurements.chest = Math.round((avgValue * constraints.chest_to_waist_min / 
        (0.6 * constraints.chest_to_waist_min + 0.4)) * 10) / 10;
      measurements.waist = Math.round((measurements.chest / constraints.chest_to_waist_min) * 10) / 10;
    }
    else if (chestToWaist > constraints.chest_to_waist_max) {
      const avgValue = (measurements.chest * 0.6 + measurements.waist * 0.4);
      measurements.chest = Math.round((avgValue * constraints.chest_to_waist_max / 
        (0.6 * constraints.chest_to_waist_max + 0.4)) * 10) / 10;
      measurements.waist = Math.round((measurements.chest / constraints.chest_to_waist_max) * 10) / 10;
    }
  }
  
  if (measurements.hips && measurements.waist) {
    const hipsToWaist = measurements.hips / measurements.waist;
    
    if (hipsToWaist < constraints.hips_to_waist_min) {
      const avgValue = (measurements.hips * 0.6 + measurements.waist * 0.4);
      measurements.hips = Math.round((avgValue * constraints.hips_to_waist_min / 
        (0.6 * constraints.hips_to_waist_min + 0.4)) * 10) / 10;
      measurements.waist = Math.round((measurements.hips / constraints.hips_to_waist_min) * 10) / 10;
    }
    else if (hipsToWaist > constraints.hips_to_waist_max) {
      const avgValue = (measurements.hips * 0.6 + measurements.waist * 0.4);
      measurements.hips = Math.round((avgValue * constraints.hips_to_waist_max / 
        (0.6 * constraints.hips_to_waist_max + 0.4)) * 10) / 10;
      measurements.waist = Math.round((measurements.hips / constraints.hips_to_waist_max) * 10) / 10;
    }
  }
  
  if (measurements.shoulder && measurements.chest) {
    const shoulderToChest = measurements.shoulder / measurements.chest;
    
    if (shoulderToChest < constraints.shoulder_to_chest_min) {
      measurements.shoulder = Math.round((measurements.chest * constraints.shoulder_to_chest_min) * 10) / 10;
    }
    else if (shoulderToChest > constraints.shoulder_to_chest_max) {
      measurements.shoulder = Math.round((measurements.chest * constraints.shoulder_to_chest_max) * 10) / 10;
    }
  }
  
  if (measurements.thigh && measurements.hips) {
    const thighToHips = measurements.thigh / measurements.hips;
    
    if (thighToHips < constraints.thigh_to_hips_min) {
      measurements.thigh = Math.round((measurements.hips * constraints.thigh_to_hips_min) * 10) / 10;
    }
    else if (thighToHips > constraints.thigh_to_hips_max) {
      measurements.thigh = Math.round((measurements.hips * constraints.thigh_to_hips_max) * 10) / 10;
    }
  }
  
  if (modelType === 'SMPL-X' || modelType === 'SIZER') {
    if (measurements.neck && measurements.chest) {
      const neckToChest = measurements.neck / measurements.chest;
      const minRatio = isMale ? 0.35 : 0.3;
      const maxRatio = isMale ? 0.42 : 0.38;
      
      if (neckToChest < minRatio) {
        measurements.neck = Math.round((measurements.chest * minRatio) * 10) / 10;
      }
      else if (neckToChest > maxRatio) {
        measurements.neck = Math.round((measurements.chest * maxRatio) * 10) / 10;
      }
    }
  }
};

export const getHighPrecisionModelAccuracyFactor = (modelType: ModelType, gender: string): number => {
  const baseFactor = {
    'SMPL': 1.02,
    'SMPL-X': 1.06,
    'STAR': 1.03,
    'PARE': 1.05,
    'SPIN': 1.04,
    'SIZER': 1.07
  }[modelType] || 1.0;
  
  const genderFactor = gender.toLowerCase() === 'female' ? 1.01 : 1.0;
  
  return baseFactor * genderFactor;
};
