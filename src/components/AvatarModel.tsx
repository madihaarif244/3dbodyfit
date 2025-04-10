
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface AvatarModelProps {
  measurements: Record<string, number>;
}

export default function AvatarModel({ measurements }: AvatarModelProps) {
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
  
  // Create a human silhouette shape using points
  const createHumanSilhouette = () => {
    // Scale factors based on measurements
    const heightScale = measurements.height ? measurements.height / 170 : 1;
    const shoulderScale = measurements.shoulder ? measurements.shoulder / 45 : 1.1;
    const chestScale = measurements.chest ? measurements.chest / 95 : 1;
    const waistScale = measurements.waist ? measurements.waist / 80 : 0.9;
    const hipsScale = measurements.hips ? measurements.hips / 98 : 1;
    
    // Base height (1.8 units in 3D space)
    const baseHeight = 1.8 * heightScale;
    
    // Body parts proportions (as ratios of total height)
    const headHeight = baseHeight * 0.15;
    const torsoHeight = baseHeight * 0.3;
    const legsHeight = baseHeight * 0.55;
    
    // Width measurements
    const headWidth = baseHeight * 0.08;
    const shoulderWidth = baseHeight * 0.22 * shoulderScale;
    const chestWidth = baseHeight * 0.17 * chestScale;
    const waistWidth = baseHeight * 0.13 * waistScale;
    const hipsWidth = baseHeight * 0.18 * hipsScale;
    const kneeWidth = baseHeight * 0.08;
    const ankleWidth = baseHeight * 0.06;
    
    // Define key points of the body (center lines, from top to bottom)
    const keyPoints: [number, number, number][] = [
      // Head
      [0, baseHeight / 2, 0], // Top of head
      [0, baseHeight / 2 - headHeight, 0], // Bottom of head / Neck
      
      // Torso
      [0, baseHeight / 2 - headHeight - torsoHeight * 0.15, 0], // Shoulders
      [0, baseHeight / 2 - headHeight - torsoHeight * 0.4, 0], // Chest
      [0, baseHeight / 2 - headHeight - torsoHeight * 0.7, 0], // Waist
      [0, baseHeight / 2 - headHeight - torsoHeight, 0], // Hips
      
      // Legs
      [0, baseHeight / 2 - headHeight - torsoHeight - legsHeight * 0.5, 0], // Knees
      [0, baseHeight / 2 - headHeight - torsoHeight - legsHeight, 0], // Feet
    ];
    
    // Define widths at each key point (distance from center to side)
    const widths = [
      headWidth, // Top of head
      headWidth * 0.7, // Neck
      shoulderWidth, // Shoulders
      chestWidth, // Chest
      waistWidth, // Waist
      hipsWidth, // Hips
      kneeWidth, // Knees
      ankleWidth, // Ankles
    ];
    
    // Generate points around the silhouette
    const silhouettePoints: [number, number, number][] = [];
    const depthRatio = 0.7; // depth to width ratio
    
    // Generate detailed silhouette with more intermediate points
    const segments = 40; // Number of vertical segments
    const radialSegments = 16; // Points around each horizontal circle
    
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      let y, width;
      
      // Interpolate height and width
      if (t <= 0.15) { // Head to neck region
        const localT = t / 0.15;
        y = THREE.MathUtils.lerp(keyPoints[0][1], keyPoints[1][1], localT);
        width = THREE.MathUtils.lerp(widths[0], widths[1], localT);
      } else if (t <= 0.45) { // Torso region
        const localT = (t - 0.15) / 0.3;
        y = THREE.MathUtils.lerp(keyPoints[1][1], keyPoints[5][1], localT);
        
        // Get more natural body curve by using cubic interpolation for torso
        const torsoT = localT;
        const torsoWidths = [widths[1], widths[2], widths[3], widths[4], widths[5]];
        const torsoIndices = [0, 0.15, 0.4, 0.7, 1.0];
        
        // Find the two closest points for interpolation
        let idx1 = 0;
        while (idx1 < torsoIndices.length - 1 && torsoIndices[idx1 + 1] < torsoT) idx1++;
        const idx2 = Math.min(idx1 + 1, torsoIndices.length - 1);
        
        const localTorsoT = (torsoT - torsoIndices[idx1]) / (torsoIndices[idx2] - torsoIndices[idx1]);
        width = THREE.MathUtils.lerp(torsoWidths[idx1], torsoWidths[idx2], localTorsoT);
      } else { // Legs region
        const localT = (t - 0.45) / 0.55;
        y = THREE.MathUtils.lerp(keyPoints[5][1], keyPoints[7][1], localT);
        
        // Use custom curve for leg tapering
        if (localT < 0.5) {
          // Hip to knee
          width = THREE.MathUtils.lerp(widths[5], widths[6], localT * 2);
        } else {
          // Knee to ankle
          width = THREE.MathUtils.lerp(widths[6], widths[7], (localT - 0.5) * 2);
        }
      }
      
      // Create points around the circumference at this height
      for (let j = 0; j < radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const x = Math.cos(theta) * width;
        const z = Math.sin(theta) * width * depthRatio;
        silhouettePoints.push([x, y, z]);
      }
    }
    
    return silhouettePoints;
  };
  
  // Generate connections between points to form the wireframe
  const generateWireframeConnections = (points: [number, number, number][], radialSegments: number) => {
    const connections: Array<[number, number, number][]> = [];
    const verticalSegments = points.length / radialSegments;
    
    // Create horizontal rings
    for (let i = 0; i < verticalSegments; i++) {
      const ringStart = i * radialSegments;
      for (let j = 0; j < radialSegments; j++) {
        const current = ringStart + j;
        const next = ringStart + ((j + 1) % radialSegments);
        connections.push([points[current], points[next]]);
      }
    }
    
    // Create vertical connections
    for (let i = 0; i < verticalSegments - 1; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const current = i * radialSegments + j;
        const below = (i + 1) * radialSegments + j;
        connections.push([points[current], points[below]]);
      }
    }
    
    // Add some cross connections for the complex mesh look
    const crossCount = points.length;
    for (let i = 0; i < crossCount; i++) {
      const randomPoint1 = Math.floor(Math.random() * points.length);
      const randomPoint2 = Math.floor(Math.random() * points.length);
      if (randomPoint1 !== randomPoint2) {
        const dist = Math.sqrt(
          Math.pow(points[randomPoint1][0] - points[randomPoint2][0], 2) +
          Math.pow(points[randomPoint1][1] - points[randomPoint2][1], 2) +
          Math.pow(points[randomPoint1][2] - points[randomPoint2][2], 2)
        );
        // Only connect if points are close enough (prevents long lines across the body)
        if (dist < 0.5) {
          connections.push([points[randomPoint1], points[randomPoint2]]);
        }
      }
    }
    
    return connections;
  };
  
  // Generate the body shape
  const silhouettePoints = createHumanSilhouette();
  const bodyConnections = generateWireframeConnections(silhouettePoints, 16);
  
  return (
    <group ref={modelRef} position={[0, -0.5, 0]} scale={1}>
      {/* Main wireframe body */}
      {bodyConnections.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="white"
          lineWidth={0.5}
          transparent
          opacity={0.8}
        />
      ))}
      
      {/* Add extra random connections for the complex network effect */}
      {Array.from({ length: 300 }).map((_, index) => {
        const point1 = silhouettePoints[Math.floor(Math.random() * silhouettePoints.length)];
        const point2 = silhouettePoints[Math.floor(Math.random() * silhouettePoints.length)];
        const distance = Math.sqrt(
          Math.pow(point1[0] - point2[0], 2) +
          Math.pow(point1[1] - point2[1], 2) +
          Math.pow(point1[2] - point2[2], 2)
        );
        
        if (distance < 0.8) {
          return (
            <Line
              key={`extra-${index}`}
              points={[point1, point2]}
              color="white"
              lineWidth={0.3}
              transparent
              opacity={0.4 + Math.random() * 0.3}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
