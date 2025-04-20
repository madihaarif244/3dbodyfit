import React, { useState } from "react";
import { Ruler } from "lucide-react";
import { GARMENT_IMAGES } from "@/constants/garmentImages";
import { cn } from "@/lib/utils";

interface SizeRecommendation {
  garment: string;
  image: string;
  recommendedSize: string;
  fit: string;
  confidence: number;
}

interface SizeRecommendationsProps {
  confidenceScore: number;
  measurements: Record<string, number>;
}

const SizeRecommendations = ({ confidenceScore, measurements }: SizeRecommendationsProps) => {
  const [selectedGarment, setSelectedGarment] = useState<number>(0);

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
        'XS': [80, 88] as [number, number],
        'S': [88, 96] as [number, number],
        'M': [96, 104] as [number, number],
        'L': [104, 112] as [number, number],
        'XL': [112, 120] as [number, number],
        'XXL': [120, 128] as [number, number]
      };
      
      const size = determineSize(measurements.chest, chestRanges);
      const fit = determineFit(measurements.chest, chestRanges, size);
      
      recommendations.push({
        garment: "Button-up Shirt",
        image: GARMENT_IMAGES.shirt,
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.95
      });

      recommendations.push({
        garment: "T-Shirt",
        image: GARMENT_IMAGES.tshirt,
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.95
      });
      
      recommendations.push({
        garment: "Jacket",
        image: GARMENT_IMAGES.jacket,
        recommendedSize: size,
        fit: fit === "Regular" ? "Standard" : fit,
        confidence: confidenceScore * 0.9
      });
    }
    
    if (measurements.waist) {
      const waistRanges = {
        'XS': [65, 73] as [number, number],
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
        image: GARMENT_IMAGES.pants,
        recommendedSize: size,
        fit,
        confidence: confidenceScore * 0.92
      });
    }
    
    return recommendations;
  };
  
  const sizeRecommendations = generateSizeRecommendations();
  const currentGarment = sizeRecommendations[selectedGarment];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <Ruler className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Virtual Try-On</h3>
      </div>
      
      {sizeRecommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setSelectedGarment(prev => 
                prev > 0 ? prev - 1 : sizeRecommendations.length - 1
              )}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              ←
            </button>
            
            <div className="flex-1 text-center">
              <div className="bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded-full text-sm">
                Recommended size: {currentGarment.recommendedSize}
              </div>
              <h4 className="text-lg font-semibold mt-2">{currentGarment.garment}</h4>
              <p className="text-sm text-gray-600">Premium cotton blend</p>
            </div>
            
            <button 
              onClick={() => setSelectedGarment(prev => 
                prev < sizeRecommendations.length - 1 ? prev + 1 : 0
              )}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              →
            </button>
          </div>

          <div className="aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={currentGarment.image} 
              alt={currentGarment.garment}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <div className="flex justify-center gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    size === currentGarment.recommendedSize
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-center text-gray-600">
              This will be a {currentGarment.fit.toLowerCase()} fit on your body.
            </p>
          </div>

          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Fit Details</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Chest:</span>
                <span>{measurements.chest} cm</span>
              </div>
              <div className="flex justify-between">
                <span>Waist:</span>
                <span>{measurements.waist} cm</span>
              </div>
              {measurements.shoulder && (
                <div className="flex justify-between">
                  <span>Shoulder:</span>
                  <span>{measurements.shoulder} cm</span>
                </div>
              )}
            </div>
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
