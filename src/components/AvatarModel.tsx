
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface AvatarModelProps {
  measurements: Record<string, number>;
}

export default function AvatarModel({ measurements }: AvatarModelProps) {
  const [avatarDimensions, setAvatarDimensions] = useState({
    height: 1.75,
    chest: 0.9,
    waist: 0.8,
    hips: 0.95,
    shoulders: 1.1,
  });
  
  // Calculate the avatar dimensions based on measurements
  useEffect(() => {
    if (!measurements || Object.keys(measurements).length === 0) return;
    
    // Create normalized dimensions
    const baseHeight = 170;
    const heightScale = measurements.height ? measurements.height / baseHeight : 1;
    
    // Calculate normalized body proportions
    const normalizedDimensions = {
      height: heightScale,
      chest: measurements.chest ? measurements.chest / 100 : 0.9,
      waist: measurements.waist ? measurements.waist / 110 : 0.8,
      hips: measurements.hips ? measurements.hips / 100 : 0.95,
      shoulders: measurements.shoulder ? measurements.shoulder / 45 : 1.1,
    };
    
    setAvatarDimensions(normalizedDimensions);
  }, [measurements]);
  
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
  
  // Generate random line segments to create the wireframe effect
  const generateWireframe = (
    center: [number, number, number], 
    dimensions: [number, number, number], 
    density: number
  ) => {
    const [cx, cy, cz] = center;
    const [width, height, depth] = dimensions;
    
    // Generate random points within the specified bounds
    const points: [number, number, number][] = [];
    
    // Random points for the body shape
    for (let i = 0; i < density; i++) {
      // Create humanoid shape by using sine functions
      const angle = Math.random() * Math.PI * 2;
      const heightPos = Math.random() * height - height/2;
      
      // Create more points around key body areas (shoulders, chest, waist, hips)
      let radiusMultiplier = 1;
      
      // Head
      if (heightPos > height/2 - height/8) {
        radiusMultiplier = 0.5;
      } 
      // Shoulders
      else if (heightPos > height/4) {
        radiusMultiplier = 1.2;
      }
      // Chest
      else if (heightPos > height/8) {
        radiusMultiplier = 1;
      }
      // Waist
      else if (heightPos > -height/8) {
        radiusMultiplier = 0.8;
      }
      // Hips
      else if (heightPos > -height/4) {
        radiusMultiplier = 1;
      }
      // Legs
      else {
        // Shape the legs by adjusting the radius based on height
        const legFactor = (heightPos + height/2) / (height/2);
        radiusMultiplier = 0.7 * legFactor;
      }
      
      // Body width varies by height
      const bodyWidth = width * radiusMultiplier;
      const bodyDepth = depth * radiusMultiplier;
      
      // Apply body shape
      const x = cx + Math.cos(angle) * bodyWidth * Math.random();
      const z = cz + Math.sin(angle) * bodyDepth * Math.random();
      
      points.push([x, cy + heightPos, z]);
    }
    
    return points;
  };
  
  // Create connections between points that are close to each other
  const generateConnections = (points: [number, number, number][], maxDistance: number) => {
    const lines: Array<[number, number, number][]> = [];
    
    // Connect nearby points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const [x1, y1, z1] = points[i];
        const [x2, y2, z2] = points[j];
        
        // Calculate distance between points
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        
        // Only connect if within max distance
        if (distance < maxDistance) {
          lines.push([points[i], points[j]]);
        }
      }
    }
    
    return lines;
  };
  
  // Calculate body dimensions based on measurements
  const bodyHeight = 2 * avatarDimensions.height;
  const bodyWidth = 0.4 * avatarDimensions.shoulders;
  const bodyDepth = 0.3 * avatarDimensions.chest;
  
  // Generate points and connections
  const bodyPoints = generateWireframe(
    [0, 0, 0],
    [bodyWidth, bodyHeight, bodyDepth],
    600 // number of points
  );
  
  const bodyConnections = generateConnections(bodyPoints, 0.3);
  
  return (
    <group ref={modelRef} position={[0, -0.5, 0]} scale={1}>
      {/* Wireframe body */}
      {bodyConnections.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="white"
          lineWidth={0.5}
          transparent
          opacity={0.7}
        />
      ))}
    </group>
  );
}
