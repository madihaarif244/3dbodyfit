import React from "react";
import { Ruler, ShirtIcon, Shirt } from "lucide-react";

interface SizeRecommendation {
  garment: string;
  recommendedSize: string;
  fit: string;
  confidence: number;
  icon?: React.ReactNode;
}

interface SizeRecommendationsProps {
  confidenceScore: number;
  measurements: Record<string, number>;
}

const SizeRecommendations = ({ confidenceScore, measurements }: SizeRecommendationsProps) => {
  const determineSize = (measurement: number, ranges: Record<string, [number, number]>): string => {
    for (const [size, [min, max]] of Object.entries(ranges)) {
      if (measurement >= min && measurement <= max) {
        return size;
      }
    }
    return measurement > Object.values(ranges)[Object.values(ranges).length - 1][1] 
      ? Object.keys(ranges)[Object.keys(ranges).length - 1] 
      : Object.keys(ranges)[0];
  };
  
  const determineFit = (measurement: number, ranges: Record<string, [number, number]>, size: string): string => {
    const [min, max] = ranges[size];
    const mid = (min + max) / 2;
    
    if (measurement < min + (max - min) * 0.2) return "Slim";
    if (measurement > min + (max - min) * 0.8) return "Relaxed";
    return "Regular";
  };
  
  const generateSizeRecommendations = (): SizeRecommendation[] => {
    const recommendations: SizeRecommendation[] = [];
    
    if (measurements.chest) {
      const chestRanges = {
        'S': [88, 96] as [number, number],
        'M': [96, 104] as [number, number],
        'L': [104, 112] as [number, number],
        'XL': [112, 120] as [number, number],
        'XXL': [120, 128] as [number, number]
      };
      
      const size = determineSize(measurements.chest, chestRanges);
      const fit = determineFit(measurements.chest, chestRanges, size);
      
      recommendations.push({
        garment: "Shirt",
        recommendedSize: size,
        fit,
        icon: <ShirtIcon className="h-5 w-5" />,
        confidence: confidenceScore * 0.95
      });

      recommendations.push({
        garment: "T-Shirt",
        recommendedSize: size,
        fit,
        icon: <Shirt className="h-5 w-5" />,
        confidence: confidenceScore * 0.95
      });
      
      recommendations.push({
        garment: "Jacket",
        recommendedSize: size,
        fit: fit === "Regular" ? "Standard" : fit,
        icon: <ShirtIcon className="h-5 w-5" />,
        confidence: confidenceScore * 0.9
      });
    }
    
    if (measurements.waist) {
      const waistRanges = {
        'S': [73, 81] as [number, number],
        'M': [81, 89] as [number, number],
        'L': [89, 97] as [number, number],
        'XL': [97, 105] as [number, number],
        'XXL': [105, 113] as [number, number]
      };
      
      const size = determineSize(measurements.waist, waistRanges);
      const fit = determineFit(measurements.waist, waistRanges, size);
      
      recommendations.push({
        garment: "Pants",
        recommendedSize: size,
        fit,
        icon: <ShirtIcon className="h-5 w-5" rotate={90} />,
        confidence: confidenceScore * 0.92
      });
    }
    
    return recommendations;
  };
  
  const sizeRecommendations = generateSizeRecommendations();
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md text-black">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <Ruler className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Virtual Try-On Size Recommendations</h3>
      </div>
      
      {sizeRecommendations.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Based on your measurements, we recommend the following sizes:
          </p>
          
          <div className="grid grid-cols-4 text-xs font-medium text-gray-500 border-b pb-1">
            <div>Garment</div>
            <div>Size</div>
            <div>Fit</div>
            <div>Accuracy</div>
          </div>
          
          {sizeRecommendations.map((rec, index) => (
            <div key={index} className="grid grid-cols-4 py-3 border-b border-gray-100 items-center text-sm">
              <div className="font-medium flex items-center gap-2">
                {rec.icon}
                {rec.garment}
              </div>
              <div className="font-bold text-blue-700">{rec.recommendedSize}</div>
              <div>{rec.fit}</div>
              <div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${rec.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p>These recommendations are generated based on standard sizing charts and your body measurements.</p>
            <p className="mt-1">Actual fit may vary by brand and style preferences.</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>Insufficient measurement data to generate size recommendations.</p>
          <p className="text-sm mt-2">Please ensure chest, waist, and hip measurements are available.</p>
        </div>
      )}
    </div>
  );
};

export default SizeRecommendations;
