
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import * as THREE from "three";

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
    
    // Create normalized dimensions (since the 3D model uses relative sizes)
    // Average adult height is around 170cm, so we use that as a baseline
    const baseHeight = 170;
    const heightScale = measurements.height ? measurements.height / baseHeight : 1;
    
    // Calculate normalized body proportions based on measurements
    const normalizedDimensions = {
      height: heightScale,
      chest: measurements.chest ? measurements.chest / 100 : 0.9,
      waist: measurements.waist ? measurements.waist / 110 : 0.8,
      hips: measurements.hips ? measurements.hips / 100 : 0.95,
      shoulders: measurements.shoulder ? measurements.shoulder / 45 : 1.1,
    };
    
    setAvatarDimensions(normalizedDimensions);
  }, [measurements]);
  
  // References for animation
  const torsoRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);
  
  // Animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Subtle breathing animation
    if (torsoRef.current) {
      torsoRef.current.scale.x = avatarDimensions.chest * (1 + Math.sin(t * 1.5) * 0.01);
      torsoRef.current.scale.z = avatarDimensions.waist * (1 + Math.sin(t * 1.5) * 0.01);
    }
    
    // Subtle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      headRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    }
    
    // Subtle arm swaying
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 0.7) * 0.1;
      rightArmRef.current.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.1;
    }
  });
  
  const skinColor = new THREE.Color("#E0C8A0");
  const clothColor = new THREE.Color("#4A5568");
  
  return (
    <group position={[0, -1, 0]} scale={[1, 1, 1]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Torso */}
      <mesh 
        ref={torsoRef} 
        position={[0, 1.9, 0]} 
        scale={[
          avatarDimensions.chest, 
          0.7, 
          avatarDimensions.waist
        ]}
      >
        <boxGeometry args={[0.5, 1, 0.3]} />
        <meshStandardMaterial color={clothColor} />
      </mesh>
      
      {/* Left Arm */}
      <group 
        ref={leftArmRef} 
        position={[
          -avatarDimensions.shoulders / 2, 
          2, 
          0
        ]}
      >
        <mesh rotation={[0, 0, -Math.PI / 8]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color={clothColor} />
        </mesh>
        
        <mesh position={[-0.1, -0.35, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.6, 16]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group 
        ref={rightArmRef} 
        position={[
          avatarDimensions.shoulders / 2, 
          2, 
          0
        ]}
      >
        <mesh rotation={[0, 0, Math.PI / 8]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color={clothColor} />
        </mesh>
        
        <mesh position={[0.1, -0.35, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.6, 16]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      
      {/* Hips */}
      <mesh 
        position={[0, 1.4, 0]} 
        scale={[
          avatarDimensions.hips * 0.9, 
          0.2, 
          avatarDimensions.hips * 0.6
        ]}
      >
        <boxGeometry args={[0.6, 1, 0.4]} />
        <meshStandardMaterial color={new THREE.Color("#2D3748")} />
      </mesh>
      
      {/* Left Leg */}
      <mesh 
        ref={leftLegRef} 
        position={[-0.2, 0.7, 0]} 
        scale={[1, measurements.inseam ? measurements.inseam / 70 : 1, 1]}
      >
        <cylinderGeometry args={[0.12, 0.1, 1.2, 16]} />
        <meshStandardMaterial color={new THREE.Color("#2D3748")} />
      </mesh>
      
      {/* Right Leg */}
      <mesh 
        ref={rightLegRef} 
        position={[0.2, 0.7, 0]} 
        scale={[1, measurements.inseam ? measurements.inseam / 70 : 1, 1]}
      >
        <cylinderGeometry args={[0.12, 0.1, 1.2, 16]} />
        <meshStandardMaterial color={new THREE.Color("#2D3748")} />
      </mesh>
    </group>
  );
}
