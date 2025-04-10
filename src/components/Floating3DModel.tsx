
import { useEffect, useRef } from 'react';

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
      
      mouseX = x * 10; // Reduced effect intensity to be more subtle
      mouseY = -y * 10;
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
            {/* Dark background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl"></div>
            
            {/* Image of woman in body measurement outfit */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
              <img 
                src="/lovable-uploads/a667a7d8-2e23-431a-891d-2f98721a4272.png"
                alt="Woman in body measurement outfit with measurement points"
                className="w-full h-full object-contain"
              />
              
              {/* Overlay for better visibility of text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
            </div>
            
            {/* Measurement point indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { id: 'A', top: '15%', left: '55%' },
                { id: 'B', top: '25%', left: '45%' },
                { id: 'C', top: '15%', left: '70%' }, 
                { id: 'D', top: '35%', left: '40%' },
                { id: 'E', top: '35%', left: '65%' },
                { id: 'F', top: '15%', left: '30%' },
                { id: 'G', top: '45%', left: '40%' },
                { id: 'H', top: '55%', left: '40%' },
                { id: 'I', top: '65%', left: '50%' }
              ].map((point) => (
                <div 
                  key={point.id}
                  className="absolute w-5 h-5 rounded-full bg-primary/80 animate-pulse-blue flex items-center justify-center"
                  style={{
                    top: point.top,
                    left: point.left,
                  }}
                >
                  <span className="text-xs font-bold text-white">{point.id}</span>
                </div>
              ))}
            </div>
            
            {/* Particle effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-primary/30 animate-pulse"
                  style={{
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
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
