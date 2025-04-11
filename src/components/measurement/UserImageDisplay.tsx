
import { FC } from "react";

interface MeasurementPoint {
  id: string;
  top: string;
  left: string;
  label: string;
}

interface UserImageDisplayProps {
  userImage?: string;
  hasLandmarks?: boolean;
}

const UserImageDisplay: FC<UserImageDisplayProps> = ({ userImage, hasLandmarks = false }) => {
  const measurementPoints: MeasurementPoint[] = [
    { id: 'A', top: '13%', left: '50%', label: 'Shoulder Width' },
    { id: 'B', top: '25%', left: '42%', label: 'Chest' },
    { id: 'C', top: '38%', left: '50%', label: 'Waist' },
    { id: 'D', top: '55%', left: '50%', label: 'Hip' },
    { id: 'E', top: '65%', left: '42%', label: 'Thigh' },
    { id: 'F', top: '80%', left: '45%', label: 'Calf' }
  ];

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg border-2 border-electric/10 h-[500px] relative">
      {userImage ? (
        <div className="w-full h-full flex items-center justify-center bg-[#0A1029]">
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
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <div className="text-center text-white">
                <div className="text-sm font-bold text-blue-400">BODY SCAN</div>
                <div className="text-xs">AI-Enhanced Measurement</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0A1029] text-white">
          <div className="text-center p-4">
            <div className="mb-2 text-lg">No image available</div>
            <p className="text-sm text-gray-400">Please upload an image during the scanning process</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImageDisplay;
