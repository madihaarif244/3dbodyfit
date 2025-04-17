
import { ModelType } from '@/types/bodyMeasurement';

export const calculateAdvancedConfidenceScore = (
  modelType: ModelType, 
  hasSideImage: boolean,
  gender: string
): number => {
  const baseConfidence: Record<ModelType, number> = {
    'SMPL': 0.89,
    'SMPL-X': 0.94,
    'STAR': 0.90,
    'PARE': 0.92,
    'SPIN': 0.91,
    'SIZER': 0.95
  };
  
  const multiViewBonus = hasSideImage ? 0.05 : 0;
  const genderModifier = gender.toLowerCase() === 'male' ? 0.01 : 0;
  const randomVariation = (Math.random() * 0.005) - 0.0025;
  
  return Math.min(0.99, baseConfidence[modelType] + multiViewBonus + genderModifier + randomVariation);
};
