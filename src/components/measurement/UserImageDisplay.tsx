
import { FC, useState } from "react";
import { Canvas } from "@react-three/fiber";
import AvatarModel from "../AvatarModel";

interface MeasurementPoint {
  id: string;
  top: string;
  left: string;
  label: string;
}

interface UserImageDisplayProps {
  userImage?: string;
  hasLandmarks?: boolean;
  measurements?: Record<string, number>;
  landmarks?: Record<string, {x: number, y: number, z: number, visibility?: number}>;
}

const UserImageDisplay: FC<UserImageDisplayProps> = ({ 
  userImage, 
  hasLandmarks = false,
  measurements = {},
  landmarks
}) => {
  const [view, setView] = useState<'image' | '3d'>(userImage ? 'image' : '3d');
  
  const measurementPoints: MeasurementPoint[] = [
    { id: 'A', top: '13%', left: '50%', label: 'Shoulder Width' },
    { id: 'B', top: '25%', left: '42%', label: 'Chest' },
    { id: 'C', top: '38%', left: '50%', label: 'Waist' },
    { id: 'D', top: '55%', left: '50%', label: 'Hip' },
    { id: 'E', top: '65%', left: '42%', label: 'Thigh' },
    { id: 'F', top: '80%', left: '45%', label: 'Calf' }
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 h-[500px] relative">
      {/* View toggle buttons */}
      {userImage && (
        <div className="absolute top-2 right-2 z-10 flex bg-white/80 backdrop-blur-sm rounded-md overflow-hidden">
          <button 
            onClick={() => setView('image')}
            className={`px-3 py-1 text-xs ${view === 'image' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Photo
          </button>
          <button 
            onClick={() => setView('3d')}
            className={`px-3 py-1 text-xs ${view === '3d' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            3D Model
          </button>
        </div>
      )}
      
      {/* 3D View */}
      {view === '3d' && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
          <Canvas 
            camera={{ position: [0, 0, 2], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <AvatarModel 
              measurements={measurements}
              landmarks={landmarks} 
            />
          </Canvas>
          
          {/* Footer info for 3D view */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-center text-gray-200">
              <div className="text-sm font-bold text-blue-400">3D AVATAR MODEL</div>
              <div className="text-xs text-gray-400">Based on your measurements</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image View */}
      {view === 'image' && userImage && (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Display user image with proper sizing */}
            <img 
              src={userImage} 
              alt="User's body scan" 
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Overlay with measurement points */}
            {hasLandmarks && (
              <div className="absolute inset-0 pointer-events-none">
                {measurementPoints.map((point) => (
                  <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                    <div className="relative">
                      <div className="absolute w-7 h-7 rounded-full bg-blue-500/60 flex items-center justify-center z-10 shadow-glow animate-pulse -translate-x-1/2 -translate-y-1/2">
                        <span className="text-xs font-bold text-white">{point.id}</span>
                      </div>
                      {/* Label */}
                      <div className="absolute left-5 top-0 whitespace-nowrap bg-black/70 px-2 py-1 rounded text-xs text-white">
                        {point.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Footer info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent">
              <div className="text-center text-gray-800">
                <div className="text-sm font-bold text-blue-600">BODY SCAN</div>
                <div className="text-xs text-gray-600">AI-Enhanced Measurement</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No image state */}
      {!userImage && view === 'image' && (
        <div className="w-full h-full flex items-center justify-center bg-white text-gray-800">
          <div className="text-center p-4">
            <div className="mb-2 text-lg">No image available</div>
            <p className="text-sm text-gray-500">Please upload an image during the scanning process</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImageDisplay;
