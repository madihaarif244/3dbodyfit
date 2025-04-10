
import { useEffect, useRef, useState } from 'react';
import { Box } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AvatarModel from './AvatarModel';

export default function Floating3DModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measurements] = useState({
    height: 175,
    chest: 95,
    waist: 80,
    hips: 98,
    shoulder: 45,
    inseam: 78
  });
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      mouseX = x * 20;
      mouseY = -y * 20;
    };
    
    const animate = () => {
      // Smooth interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      const model = container.querySelector('.model');
      if (model) {
        model.setAttribute('style', `transform: rotateY(${targetX}deg) rotateX(${targetY}deg);`);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    animate();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="perspective-[1000px] w-full h-full"
    >
      <div className="model transform-style-3d transition-transform duration-300 ease-out flex flex-col items-center justify-center h-full">
        <div className="animate-float w-full h-full">
          <div className="relative w-full h-full">
            {/* Dark background for wireframe effect */}
            <div className="absolute inset-0 bg-black rounded-xl"></div>
            
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 2.5], fov: 45 }}>
              {/* Subtle ambient light */}
              <ambientLight intensity={0.2} />
              
              {/* Key light to highlight the wireframe */}
              <directionalLight position={[5, 5, 5]} intensity={0.5} />
              <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#4080ff" />
              
              {/* Wireframe avatar model */}
              <AvatarModel measurements={measurements} />
              
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
            
            {/* Particle effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/30 animate-pulse"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center z-10">
          <div className="text-sm text-primary font-semibold">3D BODY SCAN</div>
          <div className="text-xs text-white mt-1">Powered by AI</div>
        </div>
      </div>
    </div>
  );
}
