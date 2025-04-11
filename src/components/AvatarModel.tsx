
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface AvatarModelProps {
  measurements: Record<string, number>;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
}

export default function AvatarModel({ measurements, landmarks }: AvatarModelProps) {
  // Reference for the entire model group to animate it
  const modelRef = useRef<THREE.Group>(null);
  
  // Animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Apply subtle breathing and swaying animations
    if (modelRef.current) {
      // Subtle breathing effect
      modelRef.current.scale.x = 1 + Math.sin(t * 0.5) * 0.01;
      modelRef.current.scale.z = 1 + Math.sin(t * 0.5) * 0.01;
      
      // Subtle swaying
      modelRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
      modelRef.current.position.y = Math.sin(t * 0.4) * 0.05;
    }
  });

  // Create a more elegant human body with accurate proportions based on measurements
  const createHumanBody = () => {
    // Scale factors based on measurements - using the height as reference
    // Normalize to a standard height for 3D model proportions
    const standardHeight = 170; // Average human height in cm
    const heightScale = measurements.height ? measurements.height / standardHeight : 1;
    
    // Extract body proportions from measurements or use defaults with proper scaling
    const shoulderScale = measurements.shoulder ? measurements.shoulder / (standardHeight * 0.26) : 1.1;
    const chestScale = measurements.chest ? measurements.chest / (standardHeight * 0.52) : 1;
    const waistScale = measurements.waist ? measurements.waist / (standardHeight * 0.46) : 0.9;
    const hipsScale = measurements.hips ? measurements.hips / (standardHeight * 0.58) : 1;
    
    // Base height for the 3D model
    const baseHeight = 1.8 * heightScale;
    
    // Simple, clean model points
    const bodySegments = {
      // Torso - central structure
      torso: createTorso(baseHeight, shoulderScale, chestScale, waistScale),
      
      // Limbs - cleaner, less wireframe-like
      arms: createArms(baseHeight, shoulderScale),
      legs: createLegs(baseHeight, hipsScale),
      
      // Head
      head: createHead(baseHeight)
    };
    
    return bodySegments;
  };
  
  const createTorso = (baseHeight: number, shoulderScale: number, chestScale: number, waistScale: number) => {
    const shoulderWidth = baseHeight * 0.25 * shoulderScale;
    const chestWidth = baseHeight * 0.18 * chestScale;
    const waistWidth = baseHeight * 0.15 * waistScale;
    
    const torsoTop = baseHeight * 0.8;
    const torsoBottom = baseHeight * 0.45;
    
    const points: [number, number, number][] = [];
    // Add shoulder line
    points.push([-shoulderWidth, torsoTop, 0]);
    points.push([shoulderWidth, torsoTop, 0]);
    
    // Add right side profile line
    points.push([shoulderWidth, torsoTop, 0]);
    points.push([chestWidth, torsoTop * 0.9, 0]);
    points.push([waistWidth, torsoBottom, 0]);
    
    // Add left side profile line
    points.push([-shoulderWidth, torsoTop, 0]);
    points.push([-chestWidth, torsoTop * 0.9, 0]);
    points.push([-waistWidth, torsoBottom, 0]);
    
    // Add waist line connecting sides
    points.push([-waistWidth, torsoBottom, 0]);
    points.push([waistWidth, torsoBottom, 0]);
    
    // Add central line
    points.push([0, torsoTop, 0]);
    points.push([0, torsoBottom, 0]);
    
    return points;
  };
  
  const createArms = (baseHeight: number, shoulderScale: number) => {
    const shoulderWidth = baseHeight * 0.25 * shoulderScale;
    const shoulderY = baseHeight * 0.8;
    const handY = baseHeight * 0.4;
    const elbowOffset = baseHeight * 0.05;
    
    const points: [number, number, number][] = [];
    
    // Right arm
    points.push([shoulderWidth, shoulderY, 0]);
    points.push([shoulderWidth + elbowOffset, shoulderY - baseHeight * 0.2, 0]);
    points.push([shoulderWidth, handY, 0]);
    
    // Left arm
    points.push([-shoulderWidth, shoulderY, 0]);
    points.push([-shoulderWidth - elbowOffset, shoulderY - baseHeight * 0.2, 0]);
    points.push([-shoulderWidth, handY, 0]);
    
    return points;
  };
  
  const createLegs = (baseHeight: number, hipsScale: number) => {
    const hipWidth = baseHeight * 0.18 * hipsScale;
    const hipY = baseHeight * 0.45;
    const kneeY = baseHeight * 0.25;
    const footY = 0;
    const kneeOffset = baseHeight * 0.03;
    
    const points: [number, number, number][] = [];
    
    // Connect the hip line
    points.push([-hipWidth, hipY, 0]);
    points.push([hipWidth, hipY, 0]);
    
    // Right leg
    points.push([hipWidth * 0.7, hipY, 0]);
    points.push([hipWidth * 0.7 + kneeOffset, kneeY, 0]);
    points.push([hipWidth * 0.7, footY, 0]);
    
    // Left leg
    points.push([-hipWidth * 0.7, hipY, 0]);
    points.push([-hipWidth * 0.7 - kneeOffset, kneeY, 0]);
    points.push([-hipWidth * 0.7, footY, 0]);
    
    return points;
  };
  
  const createHead = (baseHeight: number) => {
    const neckTop = baseHeight * 0.9;
    const headCenter = baseHeight * 0.95;
    const headRadius = baseHeight * 0.08;
    
    // Simple head outline
    const points: [number, number, number][] = [];
    
    // Neck line
    points.push([0, baseHeight * 0.8, 0]);
    points.push([0, neckTop, 0]);
    
    // Create a circle for head using points
    const segments = 12;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * headRadius;
      const y = Math.sin(angle) * headRadius + headCenter;
      points.push([x, y, 0]);
    }
    
    return points;
  };
  
  // Create connections for landmark visualization
  const createLandmarkVisualization = () => {
    if (!landmarks) return { points: [], connections: [] };
    
    const points: [number, number, number][] = [];
    const connections: Array<[number, number, number][]> = [];
    
    // Convert the normalized 2D coordinates to 3D space
    // The standard height of our 3D model is about 1.8 units
    const heightScale = 1.8;
    
    // Important landmarks for visualization
    const keypointNames = [
      'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
      'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
      'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
      'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'neck'
    ];
    
    // Add points for each landmark
    keypointNames.forEach(name => {
      const landmark = landmarks[name];
      if (landmark && landmark.visibility && landmark.visibility > 0.5) {
        // Convert from normalized coords to 3D space
        const point: [number, number, number] = [
          (landmark.x - 0.5) * heightScale * 0.5,
          heightScale * 0.9 - landmark.y * heightScale * 1.8,
          (landmark.visibility > 0.7 ? 0.05 : 0)
        ];
        points.push(point);
      }
    });
    
    // Create connections between landmarks (skeleton)
    const connectionPairs = [
      ['nose', 'leftEye'], ['nose', 'rightEye'], ['leftEye', 'leftEar'], ['rightEye', 'rightEar'],
      ['nose', 'neck'], ['neck', 'leftShoulder'], ['neck', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['neck', 'leftHip'], ['neck', 'rightHip'],
      ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
      ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip']
    ];
    
    // Add connections where both endpoints exist
    connectionPairs.forEach(([start, end]) => {
      const startLandmark = landmarks[start];
      const endLandmark = landmarks[end];
      
      if (startLandmark && endLandmark && 
          startLandmark.visibility && endLandmark.visibility && 
          startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
            
        const startPoint: [number, number, number] = [
          (startLandmark.x - 0.5) * heightScale * 0.5,
          heightScale * 0.9 - startLandmark.y * heightScale * 1.8,
          (startLandmark.visibility > 0.7 ? 0.05 : 0)
        ];
        
        const endPoint: [number, number, number] = [
          (endLandmark.x - 0.5) * heightScale * 0.5,
          heightScale * 0.9 - endLandmark.y * heightScale * 1.8,
          (endLandmark.visibility > 0.7 ? 0.05 : 0)
        ];
        
        connections.push([startPoint, endPoint]);
      }
    });
    
    return { points, connections };
  };
  
  // Generate body segments
  const bodyParts = createHumanBody();
  
  // Create line segments for each body part
  const torsoLines = bodyParts.torso.reduce<Array<[number, number, number][]>>((acc, point, index) => {
    if (index > 0 && index % 2 === 1) {
      acc.push([bodyParts.torso[index-1], bodyParts.torso[index]]);
    }
    return acc;
  }, []);
  
  const armLines = bodyParts.arms.reduce<Array<[number, number, number][]>>((acc, point, index) => {
    if (index > 0 && index % 3 !== 0) {
      acc.push([bodyParts.arms[index-1], bodyParts.arms[index]]);
    }
    if (index > 0 && index % 3 === 0) {
      // New arm started
      acc.push([bodyParts.arms[index-3], bodyParts.arms[index]]);
    }
    return acc;
  }, []);
  
  const legLines = bodyParts.legs.reduce<Array<[number, number, number][]>>((acc, point, index) => {
    if (index > 0 && index % 3 !== 0 && index > 2) {
      acc.push([bodyParts.legs[index-1], bodyParts.legs[index]]);
    }
    if (index > 0 && index % 3 === 0 && index > 3) {
      // New leg started
      acc.push([bodyParts.legs[index-3], bodyParts.legs[index]]);
    }
    if (index === 1) {
      // Hip line
      acc.push([bodyParts.legs[0], bodyParts.legs[1]]);
    }
    return acc;
  }, []);
  
  const headLines = bodyParts.head.reduce<Array<[number, number, number][]>>((acc, point, index) => {
    if (index === 1) {
      // Neck line
      acc.push([bodyParts.head[0], bodyParts.head[1]]);
    }
    if (index > 2) {
      // Head circle
      acc.push([bodyParts.head[index-1], bodyParts.head[index]]);
    }
    return acc;
  }, []);
  
  // Join all line segments
  const bodyLines = [
    ...torsoLines,
    ...armLines,
    ...legLines,
    ...headLines
  ];
  
  // Get landmark visualization if available
  const landmarkViz = createLandmarkVisualization();
  
  // Adjusted position to better fit in the box and show the whole model
  return (
    <group ref={modelRef} position={[0, -1.3, 0]} scale={0.7}>
      {/* Render clean body model lines */}
      {bodyLines.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="#4287f5"
          lineWidth={1.5}
          transparent
          opacity={0.8}
        />
      ))}
      
      {/* Render measurement reference points */}
      {measurements && (
        <>
          {/* Chest measurement point */}
          <mesh position={[0, 0.25, 0.05]} scale={0.025}>
            <sphereGeometry />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          
          {/* Waist measurement point */}
          <mesh position={[0, 0, 0.05]} scale={0.025}>
            <sphereGeometry />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          
          {/* Hip measurement point */}
          <mesh position={[0, -0.25, 0.05]} scale={0.025}>
            <sphereGeometry />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </>
      )}
      
      {/* Render detected landmarks if available */}
      {landmarks && landmarkViz.points.map((point, index) => (
        <mesh key={`landmark-${index}`} position={[point[0], point[1], point[2]]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Render landmark connections (skeleton) */}
      {landmarks && landmarkViz.connections.map((line, index) => (
        <Line
          key={`landmark-connection-${index}`}
          points={line}
          color="#00ffff"
          lineWidth={1.5}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}
