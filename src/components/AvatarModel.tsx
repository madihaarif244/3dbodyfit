
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

  // Generate a more anatomically correct human body
  const createHumanBody = () => {
    // Scale factors based on measurements
    const heightScale = measurements.height ? measurements.height / 170 : 1;
    const shoulderScale = measurements.shoulder ? measurements.shoulder / 45 : 1.1;
    const chestScale = measurements.chest ? measurements.chest / 95 : 1;
    const waistScale = measurements.waist ? measurements.waist / 80 : 0.9;
    const hipsScale = measurements.hips ? measurements.hips / 98 : 1;
    
    // Base height (1.8 units in 3D space)
    const baseHeight = 1.8 * heightScale;
    
    // Head
    const headPoints = generateSphere([0, baseHeight * 0.85, 0], baseHeight * 0.08, 8, 8);
    
    // Torso (trapezoid shape)
    const shoulderWidth = baseHeight * 0.25 * shoulderScale;
    const waistWidth = baseHeight * 0.15 * waistScale;
    const torsoHeight = baseHeight * 0.35;
    
    const torsoTop = baseHeight * 0.75;
    const torsoBottom = torsoTop - torsoHeight;
    
    const torsoPoints: [number, number, number][] = [];
    const torsoSegments = 12;
    
    for (let i = 0; i <= torsoSegments; i++) {
      const t = i / torsoSegments;
      const y = torsoTop - t * torsoHeight;
      const width = shoulderWidth * (1 - t) + waistWidth * t;
      const depth = width * 0.7;
      
      // Add points around the circumference at this height
      for (let j = 0; j < 16; j++) {
        const angle = (j / 16) * Math.PI * 2;
        const x = Math.cos(angle) * width;
        const z = Math.sin(angle) * depth;
        torsoPoints.push([x, y, z]);
      }
    }
    
    // Hips
    const hipsWidth = baseHeight * 0.18 * hipsScale;
    const hipsHeight = baseHeight * 0.1;
    const hipsTop = torsoBottom;
    const hipsBottom = hipsTop - hipsHeight;
    
    const hipsPoints: [number, number, number][] = [];
    const hipsSegments = 6;
    
    for (let i = 0; i <= hipsSegments; i++) {
      const t = i / hipsSegments;
      const y = hipsTop - t * hipsHeight;
      const width = waistWidth * (1 - t) + hipsWidth * t;
      const depth = width * 0.7;
      
      // Add points around the circumference at this height
      for (let j = 0; j < 16; j++) {
        const angle = (j / 16) * Math.PI * 2;
        const x = Math.cos(angle) * width;
        const z = Math.sin(angle) * depth;
        hipsPoints.push([x, y, z]);
      }
    }
    
    // Arms
    const shoulderY = torsoTop - baseHeight * 0.02;
    const armLength = baseHeight * 0.45;
    const armWidth = baseHeight * 0.05;
    
    // Left arm
    const leftArmPoints = generateCylinder(
      [-shoulderWidth, shoulderY, 0],
      [-shoulderWidth - armLength * 0.45, shoulderY - armLength * 0.55, 0],
      armWidth, 8
    );
    
    // Right arm
    const rightArmPoints = generateCylinder(
      [shoulderWidth, shoulderY, 0],
      [shoulderWidth + armLength * 0.45, shoulderY - armLength * 0.55, 0],
      armWidth, 8
    );
    
    // Legs
    const legLength = baseHeight * 0.5;
    const legWidth = baseHeight * 0.07;
    
    // Left leg
    const leftLegPoints = generateCylinder(
      [-hipsWidth * 0.6, hipsBottom, 0],
      [-hipsWidth * 0.4, hipsBottom - legLength, 0],
      legWidth, 8
    );
    
    // Right leg
    const rightLegPoints = generateCylinder(
      [hipsWidth * 0.6, hipsBottom, 0],
      [hipsWidth * 0.4, hipsBottom - legLength, 0],
      legWidth, 8
    );
    
    // Combine all points
    return {
      headPoints,
      torsoPoints,
      hipsPoints,
      leftArmPoints,
      rightArmPoints,
      leftLegPoints,
      rightLegPoints
    };
  };

  // Generate connections for a part of the body
  const generateConnections = (points: [number, number, number][], looped = true, density = 0.3) => {
    const connections: Array<[number, number, number][]> = [];
    
    // Connect sequential points
    for (let i = 0; i < points.length - 1; i++) {
      connections.push([points[i], points[i + 1]]);
    }
    
    // Close the loop if needed
    if (looped && points.length > 2) {
      connections.push([points[points.length - 1], points[0]]);
    }
    
    // Add some cross connections for more complex mesh look
    const crossCount = Math.floor(points.length * density);
    for (let i = 0; i < crossCount; i++) {
      const randomPoint1 = Math.floor(Math.random() * points.length);
      const randomPoint2 = Math.floor(Math.random() * points.length);
      if (randomPoint1 !== randomPoint2) {
        const dist = Math.sqrt(
          Math.pow(points[randomPoint1][0] - points[randomPoint2][0], 2) +
          Math.pow(points[randomPoint1][1] - points[randomPoint2][1], 2) +
          Math.pow(points[randomPoint1][2] - points[randomPoint2][2], 2)
        );
        // Only connect if points are close enough
        if (dist < 0.5) {
          connections.push([points[randomPoint1], points[randomPoint2]]);
        }
      }
    }
    
    return connections;
  };

  // Helper function to generate sphere points
  const generateSphere = (center: [number, number, number], radius: number, segments: number, rings: number) => {
    const points: [number, number, number][] = [];
    
    for (let i = 0; i <= rings; i++) {
      const phi = (Math.PI * i) / rings;
      for (let j = 0; j <= segments; j++) {
        const theta = (2 * Math.PI * j) / segments;
        const x = center[0] + radius * Math.sin(phi) * Math.cos(theta);
        const y = center[1] + radius * Math.cos(phi);
        const z = center[2] + radius * Math.sin(phi) * Math.sin(theta);
        points.push([x, y, z]);
      }
    }
    
    return points;
  };

  // Helper function to generate cylinder points
  const generateCylinder = (
    start: [number, number, number], 
    end: [number, number, number], 
    radius: number, 
    segments: number
  ) => {
    const points: [number, number, number][] = [];
    const direction = new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    );
    const length = direction.length();
    direction.normalize();
    
    // Create a perpendicular vector to generate the circle
    const perpVec = new THREE.Vector3(1, 0, 0);
    if (Math.abs(direction.dot(perpVec)) > 0.99) {
      perpVec.set(0, 1, 0);
    }
    
    const sideVec = new THREE.Vector3().crossVectors(direction, perpVec).normalize();
    const upVec = new THREE.Vector3().crossVectors(sideVec, direction).normalize();
    
    const cylinderSegments = 10; // segments along the cylinder length
    
    for (let i = 0; i <= cylinderSegments; i++) {
      const t = i / cylinderSegments;
      const segCenter = [
        start[0] + direction.x * length * t,
        start[1] + direction.y * length * t,
        start[2] + direction.z * length * t
      ] as [number, number, number];
      
      // Create circle at this segment
      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const x = segCenter[0] + (sideVec.x * Math.cos(angle) + upVec.x * Math.sin(angle)) * radius;
        const y = segCenter[1] + (sideVec.y * Math.cos(angle) + upVec.y * Math.sin(angle)) * radius;
        const z = segCenter[2] + (sideVec.z * Math.cos(angle) + upVec.z * Math.sin(angle)) * radius;
        points.push([x, y, z]);
      }
    }
    
    return points;
  };

  // Generate the human body
  const bodyParts = createHumanBody();
  
  // Generate connections for each body part
  const headConnections = generateConnections(bodyParts.headPoints, true, 0.2);
  const torsoConnections = generateConnections(bodyParts.torsoPoints, true, 0.1);
  const hipsConnections = generateConnections(bodyParts.hipsPoints, true, 0.1);
  const leftArmConnections = generateConnections(bodyParts.leftArmPoints, true, 0.1);
  const rightArmConnections = generateConnections(bodyParts.rightArmPoints, true, 0.1);
  const leftLegConnections = generateConnections(bodyParts.leftLegPoints, true, 0.1);
  const rightLegConnections = generateConnections(bodyParts.rightLegPoints, true, 0.1);
  
  // Combine all connections
  const bodyConnections = [
    ...headConnections,
    ...torsoConnections,
    ...hipsConnections,
    ...leftArmConnections,
    ...rightArmConnections,
    ...leftLegConnections,
    ...rightLegConnections,
  ];
  
  // Generate additional connections between body parts
  const additionalConnections: Array<[number, number, number][]> = [];
  
  // All points for random connections
  const allPoints = [
    ...bodyParts.headPoints,
    ...bodyParts.torsoPoints,
    ...bodyParts.hipsPoints,
    ...bodyParts.leftArmPoints,
    ...bodyParts.rightArmPoints,
    ...bodyParts.leftLegPoints,
    ...bodyParts.rightLegPoints,
  ];
  
  // Add some random connections for complex network effect
  for (let i = 0; i < 150; i++) {
    const point1 = allPoints[Math.floor(Math.random() * allPoints.length)];
    const point2 = allPoints[Math.floor(Math.random() * allPoints.length)];
    const distance = Math.sqrt(
      Math.pow(point1[0] - point2[0], 2) +
      Math.pow(point1[1] - point2[1], 2) +
      Math.pow(point1[2] - point2[2], 2)
    );
    
    if (distance < 0.4) {
      additionalConnections.push([point1, point2]);
    }
  }
  
  return (
    <group ref={modelRef} position={[0, -0.5, 0]} scale={1}>
      {/* Main body wireframe */}
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
      
      {/* Additional random connections for complex network effect */}
      {additionalConnections.map((line, index) => (
        <Line
          key={`additional-${index}`}
          points={line}
          color="white"
          lineWidth={0.3}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
}
