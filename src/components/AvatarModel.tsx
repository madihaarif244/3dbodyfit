
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

  // Create a more detailed human body
  const createHumanBody = () => {
    // Scale factors based on measurements
    const heightScale = measurements.height ? measurements.height / 170 : 1;
    const shoulderScale = measurements.shoulder ? measurements.shoulder / 45 : 1.1;
    const chestScale = measurements.chest ? measurements.chest / 95 : 1;
    const waistScale = measurements.waist ? measurements.waist / 80 : 0.9;
    const hipsScale = measurements.hips ? measurements.hips / 98 : 1;
    
    // Base height
    const baseHeight = 1.8 * heightScale;
    
    // Head (more detailed sphere)
    const headRadius = baseHeight * 0.08;
    const headCenter: [number, number, number] = [0, baseHeight * 0.85, 0];
    const headPoints = generateDetailedSphere(headCenter, headRadius, 12, 12);
    
    // Neck
    const neckTop = baseHeight * 0.82;
    const neckBottom = baseHeight * 0.78;
    const neckWidth = baseHeight * 0.025;
    const neckPoints = generateCylinder(
      [0, neckTop, 0],
      [0, neckBottom, 0],
      neckWidth, 8
    );
    
    // Torso (more detailed)
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
      // Create natural body curve
      const curveT = Math.sin(t * Math.PI);
      const width = shoulderWidth * (1 - t) + waistWidth * t;
      // Chest bulge in the upper part of torso
      const chestFactor = Math.sin(t * Math.PI * 0.5) * chestScale;
      const depth = width * 0.6 * (1 + chestFactor * 0.3);
      
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
      const hipCurve = Math.sin(t * Math.PI * 0.5);
      const width = waistWidth * (1 - t) + hipsWidth * t * (1 + hipCurve * 0.2);
      const depth = width * 0.7;
      
      // Add points around the circumference at this height
      for (let j = 0; j < 16; j++) {
        const angle = (j / 16) * Math.PI * 2;
        const x = Math.cos(angle) * width;
        const z = Math.sin(angle) * depth;
        hipsPoints.push([x, y, z]);
      }
    }
    
    // Arms with hands
    const shoulderY = torsoTop - baseHeight * 0.02;
    const armLength = baseHeight * 0.3;
    const armWidth = baseHeight * 0.04;
    const forearmLength = baseHeight * 0.25;
    
    // Left arm (upper arm + forearm + hand)
    const leftShoulderX = -shoulderWidth;
    const leftElbowX = leftShoulderX - armLength * 0.2;
    const leftElbowY = shoulderY - armLength;
    const leftWristX = leftElbowX - forearmLength * 0.2;
    const leftWristY = leftElbowY - forearmLength;
    
    // Upper left arm
    const leftUpperArmPoints = generateCylinder(
      [leftShoulderX, shoulderY, 0],
      [leftElbowX, leftElbowY, 0],
      armWidth, 8
    );
    
    // Forearm left
    const leftForearmPoints = generateCylinder(
      [leftElbowX, leftElbowY, 0],
      [leftWristX, leftWristY, 0],
      armWidth * 0.8, 8
    );
    
    // Hand left
    const leftHandPoints = generateDetailedHand(
      [leftWristX, leftWristY, 0],
      baseHeight * 0.1,
      baseHeight * 0.02,
      -1 // Left hand
    );
    
    // Right arm (upper arm + forearm + hand)
    const rightShoulderX = shoulderWidth;
    const rightElbowX = rightShoulderX + armLength * 0.2;
    const rightElbowY = shoulderY - armLength;
    const rightWristX = rightElbowX + forearmLength * 0.2;
    const rightWristY = rightElbowY - forearmLength;
    
    // Upper right arm
    const rightUpperArmPoints = generateCylinder(
      [rightShoulderX, shoulderY, 0],
      [rightElbowX, rightElbowY, 0],
      armWidth, 8
    );
    
    // Forearm right
    const rightForearmPoints = generateCylinder(
      [rightElbowX, rightElbowY, 0],
      [rightWristX, rightWristY, 0],
      armWidth * 0.8, 8
    );
    
    // Hand right
    const rightHandPoints = generateDetailedHand(
      [rightWristX, rightWristY, 0],
      baseHeight * 0.1,
      baseHeight * 0.02,
      1 // Right hand
    );
    
    // Legs with feet
    const legLength = baseHeight * 0.45;
    const lowerLegLength = baseHeight * 0.4;
    const legWidth = baseHeight * 0.06;
    
    // Left leg
    const leftHipX = -hipsWidth * 0.6;
    const leftKneeX = leftHipX;
    const leftKneeY = hipsBottom - legLength;
    const leftAnkleX = leftKneeX;
    const leftAnkleY = leftKneeY - lowerLegLength;
    
    // Upper left leg
    const leftUpperLegPoints = generateCylinder(
      [leftHipX, hipsBottom, 0],
      [leftKneeX, leftKneeY, 0],
      legWidth, 8
    );
    
    // Lower left leg
    const leftLowerLegPoints = generateCylinder(
      [leftKneeX, leftKneeY, 0],
      [leftAnkleX, leftAnkleY, 0],
      legWidth * 0.8, 8
    );
    
    // Left foot
    const leftFootPoints = generateFoot(
      [leftAnkleX, leftAnkleY, 0],
      baseHeight * 0.15, // foot length
      baseHeight * 0.04, // foot width
      -1 // Left foot
    );
    
    // Right leg
    const rightHipX = hipsWidth * 0.6;
    const rightKneeX = rightHipX;
    const rightKneeY = hipsBottom - legLength;
    const rightAnkleX = rightKneeX;
    const rightAnkleY = rightKneeY - lowerLegLength;
    
    // Upper right leg
    const rightUpperLegPoints = generateCylinder(
      [rightHipX, hipsBottom, 0],
      [rightKneeX, rightKneeY, 0],
      legWidth, 8
    );
    
    // Lower right leg
    const rightLowerLegPoints = generateCylinder(
      [rightKneeX, rightKneeY, 0],
      [rightAnkleX, rightAnkleY, 0],
      legWidth * 0.8, 8
    );
    
    // Right foot
    const rightFootPoints = generateFoot(
      [rightAnkleX, rightAnkleY, 0],
      baseHeight * 0.15, // foot length
      baseHeight * 0.04, // foot width
      1 // Right foot
    );
    
    return {
      headPoints,
      neckPoints,
      torsoPoints,
      hipsPoints,
      leftUpperArmPoints,
      leftForearmPoints,
      leftHandPoints,
      rightUpperArmPoints,
      rightForearmPoints,
      rightHandPoints,
      leftUpperLegPoints,
      leftLowerLegPoints,
      leftFootPoints,
      rightUpperLegPoints,
      rightLowerLegPoints,
      rightFootPoints
    };
  };

  // Function to generate a more detailed hand with fingers
  const generateDetailedHand = (
    wristPos: [number, number, number],
    handLength: number,
    fingerWidth: number,
    side: number // -1 for left, 1 for right
  ) => {
    const points: [number, number, number][] = [];
    
    // Palm
    const palmWidth = handLength * 0.4;
    const palmLength = handLength * 0.5;
    const palmPoints = generateBox(
      [wristPos[0], wristPos[1] - palmLength * 0.5, wristPos[2]],
      side * palmWidth,
      palmLength,
      fingerWidth * 2
    );
    points.push(...palmPoints);
    
    // Fingers
    const fingerCount = 5;
    const fingerSpacing = palmWidth * 2 / (fingerCount - 1);
    const fingerLength = handLength * 0.5;
    
    for (let i = 0; i < fingerCount; i++) {
      const fingerBaseX = wristPos[0] + side * (palmWidth - i * fingerSpacing);
      const fingerBaseY = wristPos[1] - palmLength;
      const fingerBaseZ = 0;
      
      // Different lengths for different fingers
      let thisFingerLength = fingerLength;
      if (i === 0) thisFingerLength *= 0.8; // Thumb shorter
      if (i === 2) thisFingerLength *= 1.1; // Middle finger longer
      if (i === 3) thisFingerLength *= 0.9; // Ring finger
      if (i === 4) thisFingerLength *= 0.7; // Pinky shorter
      
      // Each finger made of cylindrical segments
      points.push(...generateCylinder(
        [fingerBaseX, fingerBaseY, fingerBaseZ],
        [fingerBaseX, fingerBaseY - thisFingerLength, fingerBaseZ],
        fingerWidth,
        4
      ));
    }
    
    return points;
  };

  // Function to generate a foot
  const generateFoot = (
    anklePos: [number, number, number],
    footLength: number,
    footWidth: number,
    side: number // -1 for left, 1 for right
  ) => {
    const points: [number, number, number][] = [];
    
    // Main foot body
    const footCenter: [number, number, number] = [
      anklePos[0] + side * footLength * 0.3,
      anklePos[1] - footWidth,
      anklePos[2]
    ];
    
    points.push(...generateBox(
      footCenter,
      footLength,
      footWidth * 2,
      footWidth * 3
    ));
    
    return points;
  };

  // Helper function to generate box points
  const generateBox = (
    center: [number, number, number],
    width: number,
    height: number,
    depth: number
  ) => {
    const points: [number, number, number][] = [];
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const halfDepth = depth * 0.5;
    
    // Vertices of the box
    const vertices: [number, number, number][] = [
      [center[0] - halfWidth, center[1] - halfHeight, center[2] - halfDepth],
      [center[0] + halfWidth, center[1] - halfHeight, center[2] - halfDepth],
      [center[0] + halfWidth, center[1] + halfHeight, center[2] - halfDepth],
      [center[0] - halfWidth, center[1] + halfHeight, center[2] - halfDepth],
      [center[0] - halfWidth, center[1] - halfHeight, center[2] + halfDepth],
      [center[0] + halfWidth, center[1] - halfHeight, center[2] + halfDepth],
      [center[0] + halfWidth, center[1] + halfHeight, center[2] + halfDepth],
      [center[0] - halfWidth, center[1] + halfHeight, center[2] + halfDepth],
    ];
    
    points.push(...vertices);
    return points;
  };

  // Helper function to generate detailed sphere points
  const generateDetailedSphere = (center: [number, number, number], radius: number, segments: number, rings: number) => {
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
    
    const cylinderSegments = 5; // reduced for performance
    
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
        if (dist < 0.3) {
          connections.push([points[randomPoint1], points[randomPoint2]]);
        }
      }
    }
    
    return connections;
  };

  // Generate the human body with all parts
  const bodyParts = createHumanBody();
  
  // Generate connections for each body part
  const headConnections = generateConnections(bodyParts.headPoints, true, 0.2);
  const neckConnections = generateConnections(bodyParts.neckPoints, true, 0.1);
  const torsoConnections = generateConnections(bodyParts.torsoPoints, true, 0.1);
  const hipsConnections = generateConnections(bodyParts.hipsPoints, true, 0.1);
  const leftUpperArmConnections = generateConnections(bodyParts.leftUpperArmPoints, true, 0.1);
  const leftForearmConnections = generateConnections(bodyParts.leftForearmPoints, true, 0.1);
  const leftHandConnections = generateConnections(bodyParts.leftHandPoints, true, 0.1);
  const rightUpperArmConnections = generateConnections(bodyParts.rightUpperArmPoints, true, 0.1);
  const rightForearmConnections = generateConnections(bodyParts.rightForearmPoints, true, 0.1);
  const rightHandConnections = generateConnections(bodyParts.rightHandPoints, true, 0.1);
  const leftUpperLegConnections = generateConnections(bodyParts.leftUpperLegPoints, true, 0.1);
  const leftLowerLegConnections = generateConnections(bodyParts.leftLowerLegPoints, true, 0.1);
  const leftFootConnections = generateConnections(bodyParts.leftFootPoints, true, 0.1);
  const rightUpperLegConnections = generateConnections(bodyParts.rightUpperLegPoints, true, 0.1);
  const rightLowerLegConnections = generateConnections(bodyParts.rightLowerLegPoints, true, 0.1);
  const rightFootConnections = generateConnections(bodyParts.rightFootPoints, true, 0.1);
  
  // Combine all connections
  const bodyConnections = [
    ...headConnections,
    ...neckConnections,
    ...torsoConnections,
    ...hipsConnections,
    ...leftUpperArmConnections,
    ...leftForearmConnections,
    ...leftHandConnections,
    ...rightUpperArmConnections,
    ...rightForearmConnections,
    ...rightHandConnections,
    ...leftUpperLegConnections,
    ...leftLowerLegConnections,
    ...leftFootConnections,
    ...rightUpperLegConnections,
    ...rightLowerLegConnections,
    ...rightFootConnections,
  ];
  
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
      
      {/* Add a few additional connections between close body parts for more network-like appearance */}
      {Array.from({ length: 50 }).map((_, index) => {
        // Choose two random body parts to potentially connect
        const allBodyPartsArrays = Object.values(bodyParts);
        const randomBodyPart1 = allBodyPartsArrays[Math.floor(Math.random() * allBodyPartsArrays.length)];
        const randomBodyPart2 = allBodyPartsArrays[Math.floor(Math.random() * allBodyPartsArrays.length)];
        
        if (randomBodyPart1 && randomBodyPart2) {
          const point1 = randomBodyPart1[Math.floor(Math.random() * randomBodyPart1.length)];
          const point2 = randomBodyPart2[Math.floor(Math.random() * randomBodyPart2.length)];
          
          const distance = Math.sqrt(
            Math.pow(point1[0] - point2[0], 2) +
            Math.pow(point1[1] - point2[1], 2) +
            Math.pow(point1[2] - point2[2], 2)
          );
          
          // Only add connection if points are reasonably close
          if (distance < 0.4) {
            return (
              <Line
                key={`additional-${index}`}
                points={[point1, point2]}
                color="white"
                lineWidth={0.3}
                transparent
                opacity={0.4}
              />
            );
          }
        }
        return null;
      })}
    </group>
  );
}

