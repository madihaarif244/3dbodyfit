
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
              {/* Complete human body silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-4/5 w-2/3">
                  {/* Detailed body silhouette */}
                  <svg 
                    viewBox="0 0 100 280" 
                    className="h-full w-auto mx-auto opacity-80"
                  >
                    {/* Head */}
                    <ellipse 
                      cx="50" cy="25" rx="15" ry="17.5"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1"
                    />
                    
                    {/* Neck */}
                    <path 
                      d="M45,40 L45,50 L55,50 L55,40"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Shoulders and Torso */}
                    <path 
                      d="M30,50 
                         Q25,55 20,60
                         L20,65
                         Q25,70 15,75
                         L15,120
                         Q20,130 25,135
                         L30,160
                         
                         Q35,165 45,160
                         L50,160
                         L55,160
                         Q65,165 70,160
                         
                         L75,135
                         Q80,130 85,120
                         L85,75
                         Q75,70 80,65
                         L80,60
                         Q75,55 70,50
                         Z" 
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1"
                    />
                    
                    {/* Left Arm */}
                    <path 
                      d="M20,60 
                         L10,80 
                         L5,100
                         L5,110
                         Q10,115 15,110
                         L20,105"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
                      fill="none"
                    />
                    
                    {/* Left Hand */}
                    <path 
                      d="M5,110 
                         Q3,115 0,118
                         M5,110
                         Q7,115 10,118
                         M5,110
                         Q5,118 5,125"
                      className="fill-none stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Right Arm */}
                    <path 
                      d="M80,60 
                         L90,80 
                         L95,100
                         L95,110
                         Q90,115 85,110
                         L80,105"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1"
                      fill="none"
                    />
                    
                    {/* Right Hand */}
                    <path 
                      d="M95,110 
                         Q97,115 100,118
                         M95,110
                         Q93,115 90,118
                         M95,110
                         Q95,118 95,125"
                      className="fill-none stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Left Leg */}
                    <path 
                      d="M45,160 
                         L40,200
                         L35,240
                         Q35,245 40,250
                         Q45,255 50,250
                         L45,240
                         L45,200"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Left Foot */}
                    <path 
                      d="M35,245
                         L25,245
                         Q20,250 25,255
                         L40,255
                         L45,250"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Right Leg */}
                    <path 
                      d="M55,160 
                         L60,200
                         L65,240
                         Q65,245 60,250
                         Q55,255 50,250
                         L55,240
                         L55,200"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
                    />
                    
                    {/* Right Foot */}
                    <path 
                      d="M65,245
                         L75,245
                         Q80,250 75,255
                         L60,255
                         L55,250"
                      className="fill-primary/10 stroke-white/70" 
                      strokeWidth="1" 
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
