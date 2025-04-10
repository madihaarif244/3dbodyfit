
import { useEffect, useRef } from 'react';
import { Box3d } from 'lucide-react';

export default function Floating3DModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
        <div className="animate-float">
          <div className="relative w-36 h-64">
            {/* Body outline */}
            <div className="absolute inset-0 bg-primary/10 rounded-full w-24 mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary/20"></div>
            </div>
            
            {/* 3D grid effect */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-12 gap-1">
              {Array.from({ length: 72 }).map((_, i) => (
                <div 
                  key={i}
                  className="bg-primary/5 rounded-sm"
                  style={{
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                ></div>
              ))}
            </div>
            
            {/* Particle effect */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-primary/30 animate-pulse"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
            
            {/* Logo overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Box3d className="h-12 w-12 text-primary/80" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-primary font-semibold">3D BODY SCAN</div>
          <div className="text-xs text-muted-foreground mt-1">Powered by AI</div>
        </div>
      </div>
    </div>
  );
}
