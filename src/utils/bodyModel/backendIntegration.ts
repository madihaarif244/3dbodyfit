
import axios from 'axios';
import { ModelParams } from '@/types/bodyMeasurement';

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
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
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
