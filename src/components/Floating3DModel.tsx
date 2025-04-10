
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
            {/* Enhanced gradient overlay with better colors */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/20 to-transparent rounded-xl"></div>
            
            {/* Body measurement visualization with actual body silhouette */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-black/40 to-primary/5">
              {/* Human body silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-4/5 w-1/2">
                  {/* Body silhouette */}
                  <svg 
                    viewBox="0 0 100 240" 
                    className="h-full w-auto mx-auto opacity-80"
                  >
                    <path 
                      d="M50,10 
                         C60,10 65,15 65,22 
                         C65,29 60,32 60,35 
                         C60,40 63,45 63,55 
                         C63,65 57,75 53,85 
                         L53,100
                         C65,105 70,110 70,125
                         C70,140 65,150 60,165
                         L58,190
                         C58,195 60,200 60,210
                         C60,220 55,230 50,230
                         C45,230 40,220 40,210
                         C40,200 42,195 42,190
                         L40,165
                         C35,150 30,140 30,125
                         C30,110 35,105 47,100
                         L47,85
                         C43,75 37,65 37,55
                         C37,45 40,40 40,35
                         C40,32 35,29 35,22
                         C35,15 40,10 50,10Z" 
                      fill="none"
                      stroke="rgba(255,255,255,0.7)" 
                      strokeWidth="1"
                      className="fill-primary/10"
                    />
                  </svg>
                  
                  {/* Body silhouette overlay */}
                  <div className="absolute inset-0 opacity-70 bg-gradient-to-b from-primary/10 via-primary/5 to-black/20 rounded-3xl"></div>
                </div>
              </div>
              
              {/* Overlay for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
            </div>
            
            {/* Measurement point indicators - high quality version */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { id: 'A', top: '15%', left: '50%', label: 'Shoulder' },
                { id: 'B', top: '25%', left: '45%', label: 'Chest' },
                { id: 'C', top: '25%', left: '55%', label: 'Bust' }, 
                { id: 'D', top: '35%', left: '45%', label: 'Waist' },
                { id: 'E', top: '50%', left: '45%', label: 'Hip' },
                { id: 'F', top: '60%', left: '40%', label: 'Thigh' },
                { id: 'G', top: '75%', left: '42%', label: 'Calf' },
                { id: 'H', top: '85%', left: '45%', label: 'Ankle' }
              ].map((point) => (
                <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                  <div className="relative">
                    <div className="absolute w-5 h-5 rounded-full bg-primary/80 animate-pulse flex items-center justify-center z-10">
                      <span className="text-xs font-bold text-white">{point.id}</span>
                    </div>
                    {/* Connecting line */}
                    <div className="absolute h-px w-16 bg-primary/50 top-1/2 -translate-y-1/2 left-6"></div>
                    {/* Label */}
                    <div className="absolute left-24 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs text-white border border-primary/30">
                      {point.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced measurement grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full w-full grid grid-cols-6 grid-rows-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute top-0 bottom-0 border-r border-primary/20" style={{ left: `${(i / 6) * 100}%` }}></div>
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-primary/20" style={{ top: `${(i / 6) * 100}%` }}></div>
                ))}
              </div>
            </div>
            
            {/* Enhanced particle effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-primary/40 animate-pulse"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Data visualization elements */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
              <div className="flex gap-2 justify-around">
                {['Height', 'Weight', 'Chest', 'Waist', 'Hip'].map((metric, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-xs text-primary">{metric}</div>
                    <div className="text-sm text-white font-mono">{Math.random().toFixed(2)}</div>
                  </div>
                ))}
              </div>
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
