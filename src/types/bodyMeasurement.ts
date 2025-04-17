
export type ModelType = 'SMPL' | 'SMPL-X' | 'STAR' | 'PARE' | 'SPIN' | 'SIZER';

export interface ModelParams {
  gender: string;
  height: number;
  measurementSystem: string;
}

export interface BodyModelResult {
  measurements: Record<string, number>;
  confidence: number;
  modelType: ModelType;
  meshData?: any;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
}

export interface PoseLandmarks {
  landmarks: Array<{x: number, y: number, z: number, visibility?: number}>;
  worldLandmarks?: Array<{x: number, y: number, z: number, visibility?: number}>;
}
