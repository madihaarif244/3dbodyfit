
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VirtualTryOnProps {
  measurements: Record<string, number>;
  confidenceScore: number;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ measurements, confidenceScore }) => {
  const [currentItem, setCurrentItem] = useState(0);

  const garmentItems = [
    { type: 'T-Shirt', sizeRanges: {
      'S': { chest: [86, 94], waist: [71, 79] },
      'M': { chest: [94, 102], waist: [79, 87] },
      'L': { chest: [102, 110], waist: [87, 95] },
      'XL': { chest: [110, 118], waist: [95, 103] },
      'XXL': { chest: [118, 126], waist: [103, 111] }
    }},
    { type: 'Button-Up', sizeRanges: {
      'S': { chest: [88, 96], waist: [73, 81] },
      'M': { chest: [96, 104], waist: [81, 89] },
      'L': { chest: [104, 112], waist: [89, 97] },
      'XL': { chest: [112, 120], waist: [97, 105] },
      'XXL': { chest: [120, 128], waist: [105, 113] }
    }}
  ];

  const determineSize = (measurements: Record<string, number>, ranges: any) => {
    const { chest, waist } = measurements;
    
    for (const [size, range] of Object.entries(ranges)) {
      if (
        chest >= range.chest[0] && 
        chest <= range.chest[1] && 
        waist >= range.waist[0] && 
        waist <= range.waist[1]
      ) {
        return size;
      }
    }
    
    // If no exact match, find closest size
    const chestSizes = Object.entries(ranges).map(([size, range]) => ({
      size,
      diff: Math.abs((range.chest[0] + range.chest[1]) / 2 - chest)
    }));
    
    return chestSizes.sort((a, b) => a.diff - b.diff)[0].size;
  };

  const recommendedSize = determineSize(measurements, garmentItems[currentItem].sizeRanges);

  const nextItem = () => {
    setCurrentItem((prev) => (prev + 1) % garmentItems.length);
  };

  const prevItem = () => {
    setCurrentItem((prev) => (prev - 1 + garmentItems.length) % garmentItems.length);
  };

  return (
    <Card className="p-6 bg-gray-900">
      <h3 className="text-xl font-semibold mb-4 text-white">Virtual Try-On</h3>
      
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={prevItem}
          className="text-white hover:bg-gray-800"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex-1 text-center space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-2">{garmentItems[currentItem].type}</h4>
            <div className="text-3xl font-bold text-electric mb-2">{recommendedSize}</div>
            <p className="text-sm text-gray-300">
              Best fit for your measurements:
              <br />
              Chest: {measurements.chest?.toFixed(1)} cm
              <br />
              Waist: {measurements.waist?.toFixed(1)} cm
            </p>
          </div>

          <Button 
            className="w-full bg-electric hover:bg-electric/90"
          >
            Try On
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={nextItem}
          className="text-white hover:bg-gray-800"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </Card>
  );
};

export default VirtualTryOn;
