
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

  // Adjusted position to better fit in the box and show the whole model
  return (
    <group ref={modelRef} position={[0, -1.3, 0]} scale={0.7}>
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
    </group>
  );
}
