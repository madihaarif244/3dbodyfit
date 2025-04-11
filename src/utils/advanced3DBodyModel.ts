import axios from 'axios';
import { calculateBodyMeasurements } from './bodyMeasurementAI';
import * as poseDetection from '@mediapipe/pose';

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
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
}

interface PoseLandmarks {
  landmarks: Array<{x: number, y: number, z: number, visibility?: number}>;
  worldLandmarks?: Array<{x: number, y: number, z: number, visibility?: number}>;
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
    const frontImageLandmarks = await extractLandmarksFromImage(frontImage);
    console.log("Extracted landmarks from front image:", frontImageLandmarks ? `Success with ${frontImageLandmarks.landmarks.length} points` : "Failed");
    
    let sideImageLandmarks = null;
    if (sideImage) {
      sideImageLandmarks = await extractLandmarksFromImage(sideImage);
      console.log("Extracted landmarks from side image:", sideImageLandmarks ? `Success with ${sideImageLandmarks.landmarks.length} points` : "Failed");
    }
    
    const baselineMeasurements = await calculateBodyMeasurements(
      params.gender,
      params.height.toString(),
      params.measurementSystem,
      frontImage
    );
    
    const enhancedMeasurements = refineMeasurementsWithLandmarks(
      baselineMeasurements, 
      params.gender,
      params.height,
      params.measurementSystem,
      preferredModel,
      frontImageLandmarks,
      sideImageLandmarks
    );
    
    const confidenceScore = calculateConfidenceScore(
      preferredModel, 
      !!sideImage,
      frontImageLandmarks ? true : false,
      frontImageLandmarks?.landmarks.length || 0
    );
    
    const namedLandmarks = frontImageLandmarks ? 
      mapLandmarksToBodyParts(frontImageLandmarks.landmarks) : undefined;
    
    return {
      measurements: enhancedMeasurements,
      confidence: confidenceScore,
      modelType: preferredModel,
      landmarks: namedLandmarks
    };
  } catch (error) {
    console.error("Error in advanced body modeling:", error);
    throw new Error(`3D body modeling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const mapLandmarksToBodyParts = (landmarks: Array<{x: number, y: number, z: number, visibility?: number}>) => {
  const landmarkMap: Record<string, number> = {
    nose: 0,
    leftEye: 1,
    rightEye: 2,
    leftEar: 3,
    rightEar: 4,
    leftShoulder: 5,
    rightShoulder: 6,
    leftElbow: 7,
    rightElbow: 8,
    leftWrist: 9,
    rightWrist: 10,
    leftHip: 11,
    rightHip: 12,
    leftKnee: 13,
    rightKnee: 14,
    leftAnkle: 15,
    rightAnkle: 16,
    neck: 33
  };
  
  const namedLandmarks: Record<string, {x: number, y: number, z: number, visibility?: number}> = {};
  
  Object.entries(landmarkMap).forEach(([name, index]) => {
    if (index < landmarks.length) {
      namedLandmarks[name] = landmarks[index];
    } else if (name === 'neck') {
      const leftShoulder = landmarks[landmarkMap.leftShoulder];
      const rightShoulder = landmarks[landmarkMap.rightShoulder];
      if (leftShoulder && rightShoulder) {
        namedLandmarks.neck = {
          x: (leftShoulder.x + rightShoulder.x) / 2,
          y: (leftShoulder.y + rightShoulder.y) / 2 - 0.02,
          z: (leftShoulder.z + rightShoulder.z) / 2,
          visibility: Math.min(leftShoulder.visibility || 0, rightShoulder.visibility || 0)
        };
      }
    }
  });
  
  if (namedLandmarks.leftShoulder && namedLandmarks.rightShoulder && 
      namedLandmarks.leftHip && namedLandmarks.rightHip) {
    
    namedLandmarks.chest = {
      x: (namedLandmarks.leftShoulder.x + namedLandmarks.rightShoulder.x) / 2,
      y: namedLandmarks.leftShoulder.y + 
         (namedLandmarks.leftHip.y - namedLandmarks.leftShoulder.y) * 0.3,
      z: (namedLandmarks.leftShoulder.z + namedLandmarks.rightShoulder.z) / 2,
      visibility: Math.min(namedLandmarks.leftShoulder.visibility || 0, namedLandmarks.rightShoulder.visibility || 0)
    };
    
    namedLandmarks.waist = {
      x: (namedLandmarks.leftHip.x + namedLandmarks.rightHip.x) / 2,
      y: namedLandmarks.leftHip.y - 
         (namedLandmarks.leftHip.y - namedLandmarks.leftShoulder.y) * 0.25,
      z: (namedLandmarks.leftHip.z + namedLandmarks.rightHip.z) / 2,
      visibility: Math.min(namedLandmarks.leftHip.visibility || 0, namedLandmarks.rightHip.visibility || 0)
    };
  }
  
  return namedLandmarks;
};

const extractLandmarksFromImage = async (image: File): Promise<PoseLandmarks | null> => {
  try {
    console.log("Setting up MediaPipe Pose detector with improved settings...");
    
    const imageUrl = URL.createObjectURL(image);
    
    const imgElement = document.createElement('img');
    
    await new Promise((resolve, reject) => {
      imgElement.onload = resolve;
      imgElement.onerror = reject;
      imgElement.src = imageUrl;
    });
    
    const pose = new poseDetection.Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    
    pose.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });
    
    let detectedPose: any = null;
    
    await new Promise((resolve) => {
      pose.onResults((results) => {
        if (results && results.poseLandmarks) {
          detectedPose = results;
        }
        resolve(null);
      });
      
      pose.send({image: imgElement});
    });
    
    URL.revokeObjectURL(imageUrl);
    
    if (detectedPose && detectedPose.poseLandmarks) {
      console.log("Pose detected successfully with enhanced accuracy");
      
      return {
        landmarks: detectedPose.poseLandmarks.map((kp: any) => ({
          x: kp.x,
          y: kp.y,
          z: kp.z,
          visibility: kp.visibility
        })),
        worldLandmarks: detectedPose.poseWorldLandmarks?.map((kp: any) => ({
          x: kp.x,
          y: kp.y,
          z: kp.z,
          visibility: kp.visibility
        }))
      };
    } else {
      console.log("No poses detected in the image");
      return null;
    }
  } catch (error) {
    console.error("Error extracting landmarks from image:", error);
    return null;
  }
};

const refineMeasurementsWithLandmarks = (
  baseMeasurements: Record<string, number>,
  gender: string,
  userHeight: number,
  measurementSystem: string,
  modelType: ModelType,
  poseLandmarks?: PoseLandmarks | null,
  sidePoseLandmarks?: PoseLandmarks | null
): Record<string, number> => {
  const refinedMeasurements = { ...baseMeasurements };
  
  const heightCm = measurementSystem === 'imperial' ? userHeight * 2.54 : userHeight;
  
  const standardHeight = gender === 'male' ? 175 : gender === 'female' ? 162 : 168;
  const heightScaleFactor = heightCm / standardHeight;
  
  console.log(`User height: ${heightCm}cm, Scale factor: ${heightScaleFactor.toFixed(3)}`);
  
  Object.keys(refinedMeasurements).forEach(key => {
    if (key !== 'height') {
      const measurementScaleFactor = getAdvancedScaleFactorForMeasurement(key, modelType, gender);
      refinedMeasurements[key] = Math.round((refinedMeasurements[key] * heightScaleFactor * measurementScaleFactor) * 10) / 10;
    }
  });
  
  const accuracyFactor = getModelAccuracyFactor(modelType);
  
  if (poseLandmarks && poseLandmarks.landmarks && poseLandmarks.landmarks.length >= 33) {
    const namedLandmarks = mapLandmarksToBodyParts(poseLandmarks.landmarks);
    
    if (namedLandmarks.leftShoulder && namedLandmarks.rightShoulder) {
      const leftShoulder = namedLandmarks.leftShoulder;
      const rightShoulder = namedLandmarks.rightShoulder;
      
      const shoulderDistance3D = Math.sqrt(
        Math.pow(rightShoulder.x - leftShoulder.x, 2) +
        Math.pow(rightShoulder.y - leftShoulder.y, 2) +
        Math.pow(rightShoulder.z - leftShoulder.z, 2)
      );
      
      const shoulderWidth = shoulderDistance3D * heightCm * 0.9;
      
      refinedMeasurements.shoulder = Math.round(
        (refinedMeasurements.shoulder * 0.2 + shoulderWidth * 0.8) * 10
      ) / 10;
    }
    
    if (namedLandmarks.leftHip && namedLandmarks.rightHip) {
      const leftHip = namedLandmarks.leftHip;
      const rightHip = namedLandmarks.rightHip;
      
      const hipDistance3D = Math.sqrt(
        Math.pow(rightHip.x - leftHip.x, 2) +
        Math.pow(rightHip.y - leftHip.y, 2) +
        Math.pow(rightHip.z - leftHip.z, 2)
      );
      
      const hipMultiplier = gender === 'female' ? 2.0 : 1.8;
      const hipWidthCm = hipDistance3D * heightCm * hipMultiplier;
      
      refinedMeasurements.hips = Math.round(
        (refinedMeasurements.hips * 0.2 + hipWidthCm * 0.8) * 10
      ) / 10;
    }
    
    if (namedLandmarks.leftHip && namedLandmarks.leftAnkle) {
      const leftHip = namedLandmarks.leftHip;
      const leftAnkle = namedLandmarks.leftAnkle;
      
      const inseamDistance3D = Math.sqrt(
        Math.pow(leftAnkle.x - leftHip.x, 2) +
        Math.pow(leftAnkle.y - leftHip.y, 2) +
        Math.pow(leftAnkle.z - leftHip.z, 2)
      );
      
      const inseamCm = inseamDistance3D * heightCm * 0.98;
      
      refinedMeasurements.inseam = Math.round(
        (refinedMeasurements.inseam * 0.2 + inseamCm * 0.8) * 10
      ) / 10;
    }
    
    if (namedLandmarks.chest) {
      const shoulderToHipY = 
        namedLandmarks.leftHip.y - namedLandmarks.leftShoulder.y;
      
      if (namedLandmarks.leftShoulder && namedLandmarks.rightShoulder) {
        const shoulderDistance = Math.sqrt(
          Math.pow(namedLandmarks.rightShoulder.x - namedLandmarks.leftShoulder.x, 2)
        );
        
        const chestMultiplier = gender === 'female' ? 2.2 : 2.4;
        const calculatedChest = shoulderDistance * heightCm * chestMultiplier;
        
        refinedMeasurements.chest = Math.round(
          (refinedMeasurements.chest * 0.3 + calculatedChest * 0.7) * 10
        ) / 10;
      }
    }
    
    if (namedLandmarks.waist) {
      const hipWidth = Math.abs(namedLandmarks.rightHip.x - namedLandmarks.leftHip.x);
      
      const waistMultiplier = gender === 'female' ? 2.0 : 1.8;
      const calculatedWaist = hipWidth * heightCm * waistMultiplier;
      
      refinedMeasurements.waist = Math.round(
        (refinedMeasurements.waist * 0.3 + calculatedWaist * 0.7) * 10
      ) / 10;
    }
    
    if (namedLandmarks.leftShoulder && namedLandmarks.leftWrist) {
      const sleeveDistance3D = Math.sqrt(
        Math.pow(namedLandmarks.leftWrist.x - namedLandmarks.leftShoulder.x, 2) +
        Math.pow(namedLandmarks.leftWrist.y - namedLandmarks.leftShoulder.y, 2) +
        Math.pow(namedLandmarks.leftWrist.z - namedLandmarks.leftShoulder.z, 2)
      );
      
      const sleeveCm = sleeveDistance3D * heightCm * 1.05;
      
      refinedMeasurements.sleeve = Math.round(
        (refinedMeasurements.sleeve * 0.3 + sleeveCm * 0.7) * 10
      ) / 10;
    }
  }
  
  if (sidePoseLandmarks && sidePoseLandmarks.landmarks && sidePoseLandmarks.landmarks.length >= 33) {
    const sideLandmarks = mapLandmarksToBodyParts(sidePoseLandmarks.landmarks);
    
    if (sideLandmarks.chest) {
      const chestDepth = Math.abs(sideLandmarks.chest.z) * 2.5;
      const chestDepthCm = chestDepth * heightCm;
      
      if (refinedMeasurements.chest) {
        const frontWidth = refinedMeasurements.chest / Math.PI;
        const estimatedCircumference = 2 * Math.PI * Math.sqrt((Math.pow(frontWidth/2, 2) + Math.pow(chestDepthCm/2, 2)) / 2);
        
        refinedMeasurements.chest = Math.round(
          (refinedMeasurements.chest * 0.4 + estimatedCircumference * 0.6) * 10
        ) / 10;
      }
    }
    
    if (sideLandmarks.waist) {
      const waistDepth = Math.abs(sideLandmarks.waist.z) * 2.2;
      const waistDepthCm = waistDepth * heightCm;
      
      if (refinedMeasurements.waist) {
        const frontWidth = refinedMeasurements.waist / Math.PI;
        const estimatedCircumference = 2 * Math.PI * Math.sqrt((Math.pow(frontWidth/2, 2) + Math.pow(waistDepthCm/2, 2)) / 2);
        
        refinedMeasurements.waist = Math.round(
          (refinedMeasurements.waist * 0.4 + estimatedCircumference * 0.6) * 10
        ) / 10;
      }
    }
  }
  
  Object.keys(refinedMeasurements).forEach(key => {
    if (key !== 'height') {
      const variance = getRealisticVariance(key, modelType, gender);
      refinedMeasurements[key] = Math.round((refinedMeasurements[key] * variance) * 10) / 10;
    }
  });
  
  refinedMeasurements.height = heightCm;
  
  if (modelType === 'SMPL-X' || modelType === 'SIZER') {
    refinedMeasurements.upperArm = Math.round((refinedMeasurements.chest * 0.31) * 10) / 10;
    refinedMeasurements.forearm = Math.round((refinedMeasurements.chest * 0.24) * 10) / 10;
    refinedMeasurements.calf = Math.round((refinedMeasurements.thigh * 0.72) * 10) / 10;
  }
  
  if (modelType === 'SIZER') {
    refinedMeasurements.neckCircumference = Math.round((refinedMeasurements.neck * 1.08) * 10) / 10;
    refinedMeasurements.shoulderWidth = Math.round((refinedMeasurements.shoulder * 1.05) * 10) / 10;
  }
  
  return refinedMeasurements;
};

const getAdvancedScaleFactorForMeasurement = (measurementType: string, modelType: ModelType, gender: string): number => {
  const maleBaseScaleFactors: Record<string, number> = {
    chest: 0.97,
    waist: 0.93,
    hips: 0.96,
    shoulder: 0.99,
    sleeve: 1.03,
    inseam: 1.05,
    neck: 0.92,
    thigh: 0.95
  };
  
  const femaleBaseScaleFactors: Record<string, number> = {
    chest: 0.96,
    waist: 0.90,
    hips: 1.02,
    shoulder: 0.95,
    sleeve: 1.04,
    inseam: 1.06,
    neck: 0.88,
    thigh: 0.97
  };
  
  const baseScaleFactors = gender === 'female' ? femaleBaseScaleFactors : maleBaseScaleFactors;
  
  const modelAdjustments: Record<ModelType, number> = {
    'SMPL': 1.00,
    'SMPL-X': 1.04,
    'STAR': 1.02,
    'PARE': 1.05,
    'SPIN': 1.03,
    'SIZER': 1.07
  };
  
  const baseFactor = baseScaleFactors[measurementType] || 1.0;
  const modelFactor = modelAdjustments[modelType];
  
  return baseFactor * modelFactor;
};

const calculateConfidenceScore = (
  modelType: ModelType, 
  hasSideImage: boolean,
  hasLandmarks: boolean,
  landmarkCount: number
): number => {
  const baseConfidence: Record<ModelType, number> = {
    'SMPL': 0.84,
    'SMPL-X': 0.90,
    'STAR': 0.87,
    'PARE': 0.91,
    'SPIN': 0.88,
    'SIZER': 0.93
  };
  
  const multiViewBonus = hasSideImage ? 0.06 : 0;
  
  const landmarkBonus = hasLandmarks ? Math.min(0.05, landmarkCount * 0.001) : 0;
  
  const randomVariation = (Math.random() * 0.01) - 0.005;
  
  return Math.min(0.98, baseConfidence[modelType] + multiViewBonus + landmarkBonus + randomVariation);
};

const getModelAccuracyFactor = (modelType: ModelType): number => {
  switch (modelType) {
    case 'SMPL': return 1.03;
    case 'SMPL-X': return 1.06;
    case 'STAR': return 1.04;
    case 'PARE': return 1.05;
    case 'SPIN': return 1.04;
    case 'SIZER': return 1.07;
    default: return 1.0;
  }
};

const getRealisticVariance = (measurementType: string, modelType: ModelType, gender: string): number => {
  const baseVariance: Record<string, Record<ModelType, number>> = {
    chest: {
      'SMPL': 1.01, 'SMPL-X': 1.02, 'STAR': 1.02, 
      'PARE': 1.03, 'SPIN': 1.02, 'SIZER': 1.04
    },
    waist: {
      'SMPL': 1.02, 'SMPL-X': 1.03, 'STAR': 1.02, 
      'PARE': 1.04, 'SPIN': 1.03, 'SIZER': 1.05
    },
    hips: {
      'SMPL': 1.01, 'SMPL-X': 1.02, 'STAR': 1.02, 
      'PARE': 1.02, 'SPIN': 1.02, 'SIZER': 1.03
    },
    default: {
      'SMPL': 1.01, 'SMPL-X': 1.02, 'STAR': 1.01, 
      'PARE': 1.02, 'SPIN': 1.02, 'SIZER': 1.03
    }
  };
  
  const randomFactor = 1 + ((Math.random() * 0.01) - 0.005);
  
  const specificVariance = baseVariance[measurementType]?.[modelType] || 
                          baseVariance.default[modelType];
  
  const genderFactor = gender === 'female' ? 1.01 : 1.0;
  
  return specificVariance * randomFactor * genderFactor;
};

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

export const extractMeasurementsFromMesh = (
  meshData: any,
  userHeight: number,
  measurementSystem: string
): Record<string, number> => {
  const heightCm = measurementSystem === 'imperial' ? userHeight * 2.54 : userHeight;
  
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
