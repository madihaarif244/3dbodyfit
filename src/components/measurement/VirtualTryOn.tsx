
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ShoppingBag, Ruler, Shirt } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import AvatarModel from "../AvatarModel";
import { calculateClothingSizes, getFitDescription } from "@/utils/sizingUtils";

interface VirtualTryOnProps {
  measurements: Record<string, number>;
  gender?: 'male' | 'female' | 'other';
}

type ClothingType = 'tshirt' | 'shirt' | 'pants' | 'jacket';
type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom';

interface ClothingItem {
  id: number;
  name: string;
  type: ClothingType;
  image: string;
  description: string;
}

export default function VirtualTryOn({ measurements, gender = 'other' }: VirtualTryOnProps) {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    {
      id: 1,
      name: "Classic T-Shirt",
      type: "tshirt",
      image: "/lovable-uploads/e6d4673c-7ff6-49f4-bcd5-99a028a5b51c.png",
      description: "100% cotton classic fit t-shirt"
    },
    {
      id: 2,
      name: "Button-up Shirt",
      type: "shirt",
      image: "/lovable-uploads/e6d4673c-7ff6-49f4-bcd5-99a028a5b51c.png",
      description: "Oxford cotton button-down shirt"
    },
    {
      id: 3,
      name: "Slim Fit Pants",
      type: "pants",
      image: "/lovable-uploads/e6d4673c-7ff6-49f4-bcd5-99a028a5b51c.png",
      description: "Slim fit chino pants"
    },
    {
      id: 4,
      name: "Casual Jacket",
      type: "jacket",
      image: "/lovable-uploads/e6d4673c-7ff6-49f4-bcd5-99a028a5b51c.png",
      description: "Lightweight casual jacket"
    }
  ]);
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [sizes, setSizes] = useState<Record<ClothingType, ClothingSize>>({
    tshirt: 'M',
    shirt: 'M',
    pants: 'M',
    jacket: 'M'
  });
  const [tryingOn, setTryingOn] = useState(false);

  useEffect(() => {
    // Calculate recommended sizes when measurements change
    const recommendedSizes = calculateClothingSizes(measurements, gender);
    setSizes(recommendedSizes);
  }, [measurements, gender]);

  const handleNextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % clothingItems.length);
    setTryingOn(false);
  };

  const handlePrevItem = () => {
    setCurrentItemIndex((prev) => (prev === 0 ? clothingItems.length - 1 : prev - 1));
    setTryingOn(false);
  };

  const handleTryOn = () => {
    setTryingOn(true);
  };

  const currentItem = clothingItems[currentItemIndex];
  const currentSize = sizes[currentItem.type];
  
  // Get detailed size information based on measurements
  const getSizeFeedback = () => {
    const item = currentItem.type;
    
    // Get relevant measurements for this clothing type
    let relevantMeasurement: number;
    let fitDescription: string;
    
    if (item === 'tshirt' || item === 'shirt' || item === 'jacket') {
      relevantMeasurement = measurements.chest;
      
      if (currentSize === 'S') {
        fitDescription = "This will be a slim fit on your chest.";
      } else if (currentSize === 'M') {
        fitDescription = "This will be a regular fit on your chest.";
      } else if (currentSize === 'L') {
        fitDescription = "This will be a relaxed fit on your chest.";
      } else if (currentSize === 'XL' || currentSize === 'XXL') {
        fitDescription = "This will be a loose fit on your chest.";
      } else {
        fitDescription = "This is tailored to your exact measurements.";
      }
    } else { // pants
      relevantMeasurement = measurements.waist;
      
      if (currentSize === 'S') {
        fitDescription = "These will sit snug on your waist.";
      } else if (currentSize === 'M') {
        fitDescription = "These will sit comfortably on your waist.";
      } else if (currentSize === 'L') {
        fitDescription = "These will have some room at your waist.";
      } else if (currentSize === 'XL' || currentSize === 'XXL') {
        fitDescription = "These will be loose at the waist.";
      } else {
        fitDescription = "These are tailored to your exact measurements.";
      }
    }
    
    return fitDescription;
  };

  return (
    <Card className="bg-card border-none shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
          <span>Virtual Try-On</span>
          <div className="text-sm font-normal text-gray-300 flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>Recommended size: {currentSize}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="h-[350px] bg-gray-800/70 rounded-lg overflow-hidden relative flex items-center justify-center">
            {!tryingOn ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={currentItem.image} 
                  alt={currentItem.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <>
                <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 50 }}>
                  <ambientLight intensity={0.8} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                  <AvatarModel measurements={measurements} />
                  <OrbitControls enableZoom={true} enablePan={false} />
                  <Environment preset="city" />
                </Canvas>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-electric/90 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {currentItem.name} - Size {currentSize}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handlePrevItem} 
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">{currentItem.name}</h3>
                <p className="text-sm text-gray-300">{currentItem.description}</p>
              </div>
              
              <button 
                onClick={handleNextItem}
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-200 mb-1">Size Recommendation</h4>
              <div className="flex justify-between items-center gap-2">
                {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ClothingSize[]).map((size) => (
                  <div 
                    key={size}
                    className={`flex-1 py-2 text-center rounded ${
                      size === currentSize 
                        ? 'bg-electric text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {size}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-200 mt-2 bg-gray-800/70 p-2 rounded">
                {getSizeFeedback()}
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Fit Details</h4>
              <ul className="text-sm text-gray-200">
                <li className="flex justify-between mb-2 border-b border-gray-700 pb-1">
                  <span>Chest:</span> 
                  <span className="font-semibold">{measurements.chest.toFixed(1)} cm</span>
                </li>
                <li className="flex justify-between mb-2 border-b border-gray-700 pb-1">
                  <span>Waist:</span> 
                  <span className="font-semibold">{measurements.waist.toFixed(1)} cm</span>
                </li>
                <li className="flex justify-between mb-2 border-b border-gray-700 pb-1">
                  <span>Shoulder:</span> 
                  <span className="font-semibold">{measurements.shoulder.toFixed(1)} cm</span>
                </li>
                <li className="flex justify-between">
                  <span>Sleeve:</span> 
                  <span className="font-semibold">{measurements.sleeve.toFixed(1)} cm</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={handleTryOn}
          className="w-full gap-2"
        >
          <Shirt className="h-4 w-4" />
          Try On
        </Button>
        <Button 
          className="w-full gap-2 bg-electric hover:bg-electric-dark"
        >
          <ShoppingBag className="h-4 w-4" />
          Shop This Size
        </Button>
      </CardFooter>
    </Card>
  );
}
