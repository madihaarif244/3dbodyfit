
import { calculateBodyMeasurements } from './bodyMeasurementAI';
import { refineMeasurementsWithAdvancedAlgorithm } from './bodyModel/measurementRefinement';
import { calculateAdvancedConfidenceScore } from './bodyModel/confidenceCalculation';
import { process3DModelWithBackend, extractMeasurementsFromMesh } from './bodyModel/backendIntegration';
import { ModelType, ModelParams, BodyModelResult } from '@/types/bodyMeasurement';

export const getBodyMeasurementsFromImages = async (
  frontImage: File | null,
  sideImage: File | null,
  params: ModelParams,
  preferredModel: ModelType = 'SMPL-X'
): Promise<BodyModelResult> => {
  console.log("Running advanced 3D body modeling with:", preferredModel);
  console.log("Processing images and parameters:", params);
  
  if (!frontImage) {
    throw new Error('Front image is required for 3D body modeling');
  }

  try {
    const baselineMeasurements = await calculateBodyMeasurements(
      params.gender,
      params.height.toString(),
      params.measurementSystem,
      frontImage
    );
    
    const enhancedMeasurements = refineMeasurementsWithAdvancedAlgorithm(
      baselineMeasurements, 
      params.gender,
      params.height,
      params.measurementSystem,
      preferredModel,
      !!sideImage
    );
    
    const confidenceScore = calculateAdvancedConfidenceScore(
      preferredModel, 
      !!sideImage,
      params.gender
    );
    
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

export { process3DModelWithBackend, extractMeasurementsFromMesh };
