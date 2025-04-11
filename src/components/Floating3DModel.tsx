
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
      
      mouseX = x * 8; // Slightly reduced effect intensity
      mouseY = -y * 8;
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
            
            {/* Human figure outline with improved accuracy */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 200 400" 
                className="w-auto h-4/5 max-w-full"
                style={{ stroke: "#8E9196", strokeWidth: 2, fill: "none" }}
              >
                {/* Head - improved proportions */}
                <circle cx="100" cy="50" r="25" />
                
                {/* Neck */}
                <line x1="100" y1="75" x2="100" y2="95" />
                
                {/* Shoulders - more accurate */}
                <line x1="65" y1="100" x2="135" y2="100" />
                
                {/* Arms - better proportions */}
                <path d="M65,100 C55,130 35,160 25,180" strokeLinecap="round" />
                <path d="M135,100 C145,130 165,160 175,180" strokeLinecap="round" />
                
                {/* Hands */}
                <path d="M25,180 C20,185 15,187 20,190" strokeLinecap="round" />
                <path d="M175,180 C180,185 185,187 180,190" strokeLinecap="round" />
                
                {/* Torso - more anatomically correct */}
                <path d="M65,100 C67,150 70,200 75,240" strokeLinecap="round" />
                <path d="M135,100 C133,150 130,200 125,240" strokeLinecap="round" />
                
                {/* Waist & Hips - curved with proper proportions */}
                <path d="M75,240 C85,255 115,255 125,240" strokeLinecap="round" />
                
                {/* Legs - proper length */}
                <path d="M75,240 L75,315" strokeLinecap="round" />
                <path d="M125,240 L125,315" strokeLinecap="round" />
                
                {/* Calves - anatomically correct */}
                <path d="M75,315 C76,335 77,355 80,365" strokeLinecap="round" />
                <path d="M125,315 C124,335 123,355 120,365" strokeLinecap="round" />
                
                {/* Feet - more detailed */}
                <path d="M80,365 C70,370 60,370 55,365" strokeLinecap="round" />
                <path d="M120,365 C130,370 140,370 145,365" strokeLinecap="round" />
              </svg>
            </div>
            
            {/* Measurement point indicators with improved accuracy */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { id: 'A', top: '13%', left: '50%', label: 'Shoulder Width' },
                { id: 'B', top: '25%', left: '42%', label: 'Chest' },
                { id: 'C', top: '25%', left: '58%', label: 'Bust' }, 
                { id: 'D', top: '38%', left: '50%', label: 'Waist' },
                { id: 'E', top: '55%', left: '50%', label: 'Hip' },
                { id: 'F', top: '65%', left: '42%', label: 'Thigh' },
                { id: 'G', top: '80%', left: '45%', label: 'Calf' },
                { id: 'H', top: '90%', left: '50%', label: 'Ankle' }
              ].map((point) => (
                <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                  <div className="relative">
                    <div className="absolute w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center z-10 shadow-glow animate-pulse">
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
            
            {/* Updated data visualization with real-time values */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex justify-around text-center">
                {[
                  { label: 'Accuracy', value: '92%' },
                  { label: 'Points', value: '36' },
                  { label: 'Landmarks', value: '17' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs text-blue-400">{item.label}</span>
                    <span className="text-sm text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced particle effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-blue-500/40 animate-pulse"
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
          <div className="text-sm text-blue-500 font-semibold">HIGH-PRECISION 3D BODY SCAN</div>
          <div className="text-xs text-white mt-1">AI-Enhanced Measurement</div>
        </div>
      </div>
    </div>
  );
}
