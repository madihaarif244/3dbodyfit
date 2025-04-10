
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
            {/* Dark blue background with grid overlay */}
            <div className="absolute inset-0 bg-[#0A1029] rounded-xl">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute top-0 bottom-0 border-r border-blue-300/20" style={{ left: `${(i / 12) * 100}%` }}></div>
                ))}
                {Array.from({ length: 13 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-blue-300/20" style={{ top: `${(i / 12) * 100}%` }}></div>
                ))}
              </div>
            </div>
            
            {/* Human figure outline - simplified like in the reference image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 200 400" 
                className="w-auto h-4/5 max-w-full"
                style={{ stroke: "#8E9196", strokeWidth: 2, fill: "none" }}
              >
                {/* Head */}
                <circle cx="100" cy="50" r="30" />
                
                {/* Neck */}
                <line x1="100" y1="80" x2="100" y2="100" />
                
                {/* Shoulders */}
                <line x1="60" y1="100" x2="140" y2="100" />
                
                {/* Arms */}
                <path d="M60,100 C50,130 30,150 20,180" />
                <path d="M140,100 C150,130 170,150 180,180" />
                
                {/* Hands */}
                <path d="M20,180 C15,185 10,190 15,195" />
                <path d="M180,180 C185,185 190,190 185,195" />
                
                {/* Torso */}
                <path d="M60,100 C60,150 60,200 70,250" />
                <path d="M140,100 C140,150 140,200 130,250" />
                
                {/* Waist & Hips */}
                <path d="M70,250 C80,260 120,260 130,250" />
                
                {/* Legs */}
                <path d="M70,250 L70,320" />
                <path d="M130,250 L130,320" />
                
                {/* Calves */}
                <path d="M70,320 L75,370" />
                <path d="M130,320 L125,370" />
                
                {/* Feet */}
                <path d="M75,370 C65,375 55,375 50,370" />
                <path d="M125,370 C135,375 145,375 150,370" />
              </svg>
            </div>
            
            {/* Measurement point indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { id: 'A', top: '12.5%', left: '50%', label: 'Shoulder' },
                { id: 'B', top: '25%', left: '40%', label: 'Chest' },
                { id: 'C', top: '25%', left: '60%', label: 'Bust' }, 
                { id: 'D', top: '40%', left: '50%', label: 'Waist' },
                { id: 'E', top: '60%', left: '50%', label: 'Hip' },
                { id: 'F', top: '70%', left: '42%', label: 'Thigh' },
                { id: 'G', top: '82%', left: '45%', label: 'Calf' },
                { id: 'H', top: '92%', left: '50%', label: 'Ankle' }
              ].map((point) => (
                <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                  <div className="relative">
                    <div className="absolute w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center z-10">
                      <span className="text-xs font-bold text-white">{point.id}</span>
                    </div>
                    {/* Label */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {point.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Data visualization at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex justify-around text-center">
                {[
                  { label: 'Weight', value: '0.70' },
                  { label: 'Chest', value: '0.46' },
                  { label: 'Waist', value: '0.72' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs text-blue-500">{item.label}</span>
                    <span className="text-sm text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Subtle particle effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-blue-500/30 animate-pulse"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
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
          <div className="text-sm text-blue-500 font-semibold">3D BODY SCAN</div>
          <div className="text-xs text-white mt-1">Powered by AI</div>
        </div>
      </div>
    </div>
  );
}
