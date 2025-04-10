import { Download, Mail, RotateCcw, Info, AlertCircle, HelpCircle, Shirt, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeasurementAccuracyGuide } from "@/components/MeasurementAccuracyGuide";
import { Badge } from "@/components/ui/badge";

interface MeasurementResultsProps {
  measurements: Record<string, number>;
  onReset: () => void;
  confidenceScore?: number;
  isEstimated?: boolean;
}

const MEASUREMENT_DISPLAY_MAP: Record<string, string> = {
  chest: "Chest",
  waist: "Waist",
  hips: "Hips",
  inseam: "Inseam",
  shoulder: "Shoulder Width",
  sleeve: "Sleeve Length",
  neck: "Neck",
  thigh: "Thigh"
};

const cmToInches = (cm: number): number => {
  return cm / 2.54;
};

const getSizingSuggestion = (measurement: string, value: number, gender: string = "neutral"): string => {
  type SizingRange = [number, number, string];
  
  const sizingCharts: Record<string, Record<string, SizingRange[]>> = {
    chest: {
      male: [
        [86, 91, "XS"],
        [91, 96, "S"],
        [96, 101, "M"],
        [101, 106, "L"],
        [106, 111, "XL"],
        [111, 116, "XXL"],
        [116, 999, "3XL"]
      ],
      female: [
        [76, 81, "XXS"],
        [81, 86, "XS"],
        [86, 91, "S"],
        [91, 96, "M"],
        [96, 101, "L"],
        [101, 106, "XL"],
        [106, 111, "XXL"],
        [111, 999, "3XL"]
      ],
      neutral: [
        [79, 84, "XXS"],
        [84, 89, "XS"],
        [89, 94, "S"],
        [94, 99, "M"],
        [99, 104, "L"],
        [104, 109, "XL"],
        [109, 114, "XXL"],
        [114, 999, "3XL"]
      ]
    },
    waist: {
      male: [
        [66, 71, "XS"],
        [71, 76, "S"],
        [76, 81, "M"],
        [81, 86, "L"],
        [86, 91, "XL"],
        [91, 96, "XXL"],
        [96, 999, "3XL"]
      ],
      female: [
        [56, 61, "XXS"],
        [61, 66, "XS"],
        [66, 71, "S"],
        [71, 76, "M"],
        [76, 81, "L"],
        [81, 86, "XL"],
        [86, 91, "XXL"],
        [91, 999, "3XL"]
      ],
      neutral: [
        [61, 66, "XXS"],
        [66, 71, "XS"],
        [71, 76, "S"],
        [76, 81, "M"],
        [81, 86, "XL"],
        [86, 91, "XXL"],
        [91, 96, "XXL"],
        [96, 999, "3XL"]
      ]
    },
    hips: {
      male: [
        [86, 91, "XS"],
        [91, 96, "S"],
        [96, 101, "M"],
        [101, 106, "L"],
        [106, 111, "XL"],
        [111, 116, "XXL"],
        [116, 999, "3XL"]
      ],
      female: [
        [86, 91, "XXS"],
        [91, 96, "XS"],
        [96, 101, "S"],
        [101, 106, "M"],
        [106, 111, "L"],
        [111, 116, "XL"],
        [116, 121, "XXL"],
        [121, 999, "3XL"]
      ],
      neutral: [
        [86, 91, "XS"],
        [91, 96, "S"],
        [96, 101, "M"],
        [101, 106, "L"],
        [106, 111, "XL"],
        [111, 116, "XXL"],
        [116, 999, "3XL"]
      ]
    },
    neck: {
      male: [
        [33, 36, "13-14″"],
        [36, 38, "14.5-15″"],
        [38, 40, "15.5-16″"],
        [40, 42, "16.5-17″"],
        [42, 44, "17.5-18″"],
        [44, 999, "18.5″+"]
      ],
      female: [
        [30, 32, "XXS"],
        [32, 34, "XS"],
        [34, 36, "S"],
        [36, 38, "M"],
        [38, 40, "L"],
        [40, 42, "XL"],
        [42, 999, "XXL"]
      ],
      neutral: [
        [31, 34, "XS"],
        [34, 36, "S"],
        [36, 38, "M"],
        [38, 40, "L"],
        [40, 42, "XL"],
        [42, 999, "XXL"]
      ]
    },
    shoulder: {
      male: [
        [40, 42, "XS"],
        [42, 44, "S"],
        [44, 46, "M"],
        [46, 48, "L"],
        [48, 50, "XL"],
        [50, 999, "XXL"]
      ],
      female: [
        [36, 38, "XXS"],
        [38, 40, "XS"],
        [40, 42, "S"],
        [42, 44, "M"],
        [44, 46, "L"],
        [46, 48, "XL"],
        [48, 999, "XXL"]
      ],
      neutral: [
        [38, 40, "XS"],
        [40, 42, "S"],
        [42, 44, "M"],
        [44, 46, "L"],
        [46, 48, "XL"],
        [48, 999, "XXL"]
      ]
    },
    inseam: {
      male: [
        [74, 77, "Short (28-30″)"],
        [77, 82, "Regular (30-32″)"],
        [82, 87, "Long (32-34″)"],
        [87, 999, "Extra Long (34″+)"]
      ],
      female: [
        [68, 71, "Petite (26-28″)"],
        [71, 76, "Regular (28-30″)"],
        [76, 81, "Long (30-32″)"],
        [81, 999, "Extra Long (32″+)"]
      ],
      neutral: [
        [71, 74, "Short (28″)"],
        [74, 79, "Regular (30″)"],
        [79, 84, "Long (32″)"],
        [84, 999, "Extra Long (34″+)"]
      ]
    },
    default: {
      neutral: [
        [0, Infinity, "Custom fit recommended"]
      ]
    }
  };
  
  const chart = sizingCharts[measurement] || sizingCharts.default;
  const sizeRanges = chart[gender] || chart.neutral;
  
  for (const [min, max, size] of sizeRanges) {
    if (value >= min && value < max) {
      return size;
    }
  }
  
  return "Custom fit";
};

const getClothingSizeRecommendations = (measurements: Record<string, number>, gender: string = "neutral"): Record<string, string[]> => {
  const recommendations: Record<string, string[]> = {};
  
  if (measurements.chest) {
    const chestSize = getSizingSuggestion('chest', measurements.chest, gender);
    let shoulderNote = "";
    
    if (measurements.shoulder) {
      const shoulderSize = getSizingSuggestion('shoulder', measurements.shoulder, gender);
      if (shoulderSize !== chestSize) {
        shoulderNote = ` (shoulder fit may need ${shoulderSize})`;
      }
    }
    
    recommendations.tops = [
      `${chestSize}${shoulderNote}`,
      `Chest: ${measurements.chest.toFixed(1)} cm / ${cmToInches(measurements.chest).toFixed(1)} in`
    ];
    
    if (measurements.shoulder) {
      recommendations.tops.push(`Shoulder: ${measurements.shoulder.toFixed(1)} cm / ${cmToInches(measurements.shoulder).toFixed(1)} in`);
    }
    
    if (gender === 'male' || gender === 'neutral') {
      if (measurements.chest < 96) recommendations.tops.push('Slim fit recommended');
      else if (measurements.chest > 106) recommendations.tops.push('Regular/relaxed fit recommended');
    } else {
      if (measurements.chest < 86) recommendations.tops.push('Fitted style recommended');
      else if (measurements.chest > 96) recommendations.tops.push('Relaxed fit recommended');
    }
  }
  
  if (measurements.waist) {
    const waistSize = getSizingSuggestion('waist', measurements.waist, gender);
    let hipsNote = "";
    let inseamSize = "";
    
    if (measurements.hips) {
      const hipSize = getSizingSuggestion('hips', measurements.hips, gender);
      if (hipSize !== waistSize) {
        hipsNote = ` (may need ${hipSize} for hips)`;
      }
    }
    
    if (measurements.inseam) {
      inseamSize = getSizingSuggestion('inseam', measurements.inseam, gender);
    }
    
    let numericSize = '';
    if (gender === 'male') {
      switch(waistSize) {
        case 'XXS': numericSize = '26-28'; break;
        case 'XS': numericSize = '28-30'; break;
        case 'S': numericSize = '30-32'; break;
        case 'M': numericSize = '32-34'; break;
        case 'L': numericSize = '36-38'; break;
        case 'XL': numericSize = '40-42'; break;
        case 'XXL': numericSize = '44-46'; break;
        case '3XL': numericSize = '48-50'; break;
        default: numericSize = waistSize;
      }
    } else {
      switch(waistSize) {
        case 'XXS': numericSize = '00'; break;
        case 'XS': numericSize = '0-2'; break;
        case 'S': numericSize = '4-6'; break;
        case 'M': numericSize = '8-10'; break;
        case 'L': numericSize = '12-14'; break;
        case 'XL': numericSize = '16-18'; break;
        case 'XXL': numericSize = '20-22'; break;
        case '3XL': numericSize = '24-26'; break;
        default: numericSize = waistSize;
      }
    }
    
    recommendations.bottoms = [
      `${waistSize}${hipsNote} (${numericSize})`,
      `Waist: ${measurements.waist.toFixed(1)} cm / ${cmToInches(measurements.waist).toFixed(1)} in`
    ];
    
    if (measurements.hips) {
      recommendations.bottoms.push(`Hip: ${measurements.hips.toFixed(1)} cm / ${cmToInches(measurements.hips).toFixed(1)} in`);
    }
    
    if (inseamSize) {
      recommendations.bottoms.push(`Length: ${inseamSize}`);
    }
    
    if (measurements.waist && measurements.hips) {
      const waistHipRatio = measurements.waist / measurements.hips;
      if (gender === 'female' && waistHipRatio < 0.8) {
        recommendations.bottoms.push('Curvy fit recommended');
      } else if (gender === 'male' && waistHipRatio > 0.95) {
        recommendations.bottoms.push('Athletic fit recommended');
      }
    }
  }
  
  if (measurements.chest) {
    const outerwearChest = measurements.chest + 5;
    const outerwearSize = getSizingSuggestion('chest', outerwearChest, gender);
    
    recommendations.outerwear = [
      `${outerwearSize}`,
      `Allow extra room for layering`,
      `Chest (with layering): ${outerwearChest.toFixed(1)} cm / ${cmToInches(outerwearChest).toFixed(1)} in`
    ];
    
    if (measurements.sleeve) {
      const sleeveInches = cmToInches(measurements.sleeve).toFixed(1);
      recommendations.outerwear.push(`Sleeve length: ${sleeveInches}″`);
      
      if (Number(sleeveInches) < 32) {
        recommendations.outerwear.push('Short sleeve length');
      } else if (Number(sleeveInches) > 35) {
        recommendations.outerwear.push('Long sleeve length');
      }
    }
  }
  
  if (measurements.neck && (gender === 'male' || gender === 'neutral')) {
    const neckInches = cmToInches(measurements.neck).toFixed(1);
    const neckSize = getSizingSuggestion('neck', measurements.neck, gender);
    let sleeveInfo = "";
    
    if (measurements.sleeve) {
      const sleeveInches = cmToInches(measurements.sleeve).toFixed(1);
      sleeveInfo = `, Sleeve: ${sleeveInches}″`;
    }
    
    recommendations.dressShirts = [
      `${neckSize}${sleeveInfo}`,
      `Neck: ${measurements.neck.toFixed(1)} cm / ${neckInches} in`
    ];
    
    if (measurements.sleeve) {
      recommendations.dressShirts.push(`Sleeve: ${measurements.sleeve.toFixed(1)} cm / ${cmToInches(measurements.sleeve).toFixed(1)} in`);
    }
    
    if (measurements.chest && measurements.neck) {
      const neckToChestRatio = measurements.neck / measurements.chest;
      if (neckToChestRatio > 0.41) {
        recommendations.dressShirts.push('Consider regular fit');
      } else {
        recommendations.dressShirts.push('Consider slim/tailored fit');
      }
    }
  }
  
  if (gender === 'female' && measurements.chest && measurements.waist && measurements.hips) {
    let dressSize = '';
    const chestSize = getSizingSuggestion('chest', measurements.chest, gender);
    const waistSize = getSizingSuggestion('waist', measurements.waist, gender);
    const hipSize = getSizingSuggestion('hips', measurements.hips, gender);
    
    const allSizes = [chestSize, waistSize, hipSize];
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    let maxSizeIndex = -1;
    
    for (const size of allSizes) {
      const sizeIndex = sizeOrder.indexOf(size);
      if (sizeIndex > maxSizeIndex) {
        maxSizeIndex = sizeIndex;
      }
    }
    
    const recommendedSize = maxSizeIndex >= 0 ? sizeOrder[maxSizeIndex] : 'Custom';
    
    switch(recommendedSize) {
      case 'XXS': dressSize = '00'; break;
      case 'XS': dressSize = '0-2'; break;
      case 'S': dressSize = '4-6'; break;
      case 'M': dressSize = '8-10'; break;
      case 'L': dressSize = '12-14'; break;
      case 'XL': dressSize = '16-18'; break;
      case 'XXL': dressSize = '20-22'; break;
      case '3XL': dressSize = '24-26'; break;
      default: dressSize = 'Custom';
    }
    
    recommendations.dresses = [
      `Size ${dressSize} (${recommendedSize})`,
      `Bust: ${measurements.chest.toFixed(1)} cm / ${cmToInches(measurements.chest).toFixed(1)} in`,
      `Waist: ${measurements.waist.toFixed(1)} cm / ${cmToInches(measurements.waist).toFixed(1)} in`,
      `Hip: ${measurements.hips.toFixed(1)} cm / ${cmToInches(measurements.hips).toFixed(1)} in`
    ];
    
    if (measurements.waist / measurements.hips < 0.75) {
      recommendations.dresses.push('A-line or fit-and-flare styles recommended');
    } else if (measurements.chest / measurements.hips > 1.05) {
      recommendations.dresses.push('Empire waist or A-line styles recommended');
    } else if (Math.abs(measurements.chest - measurements.hips) < 5 && measurements.waist / measurements.hips > 0.8) {
      recommendations.dresses.push('Sheath or shift dress styles recommended');
    }
  }
  
  if (gender === 'male' && measurements.chest) {
    const chestInches = Math.round(cmToInches(measurements.chest));
    let fitType = 'Regular';
    let lengthType = 'Regular';
    
    if (measurements.waist) {
      const drop = measurements.chest - measurements.waist;
      if (drop > 18) {
        fitType = 'Athletic';
      } else if (drop < 12) {
        fitType = 'Relaxed';
      }
    }
    
    if (measurements.height) {
      if (measurements.height < 170) {
        lengthType = 'Short';
      } else if (measurements.height > 185) {
        lengthType = 'Long';
      }
    }
    
    recommendations.suits = [
      `${chestInches} ${lengthType} ${fitType}`,
      `Chest: ${measurements.chest.toFixed(1)} cm / ${chestInches} in`
    ];
    
    if (measurements.waist) {
      const trouserInches = Math.round(cmToInches(measurements.waist));
      recommendations.suits.push(`Trouser waist: ${trouserInches}″`);
    }
    
    if (measurements.inseam) {
      const inseamInfo = getSizingSuggestion('inseam', measurements.inseam, gender);
      recommendations.suits.push(`Trouser length: ${inseamInfo}`);
    }
    
    if (measurements.shoulder) {
      if (measurements.shoulder > 46) {
        recommendations.suits.push('Consider a wider lapel for proportion');
      } else if (measurements.shoulder < 42) {
        recommendations.suits.push('Consider a narrower lapel for proportion');
      }
    }
  }
  
  return recommendations;
};

export default function MeasurementResults({ measurements, onReset, confidenceScore = 0.85, isEstimated = false }: MeasurementResultsProps) {
  console.log("Rendering MeasurementResults with:", measurements, "confidence:", confidenceScore, "isEstimated:", isEstimated);
  
  const handleDownload = () => {
    const text = Object.entries(measurements)
      .map(([key, value]) => {
        const inches = cmToInches(value);
        return `${MEASUREMENT_DISPLAY_MAP[key] || key}: ${value.toFixed(1)} cm / ${inches.toFixed(1)} inches`;
      })
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'body-measurements.txt';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Measurements Downloaded",
      description: "Your measurements have been saved as a text file.",
    });
  };
  
  const handleEmailResults = () => {
    toast({
      title: "Email Feature",
      description: "In a production app, this would send measurements to your email.",
    });
  };

  const getConfidenceLevel = () => {
    if (confidenceScore >= 0.9) return { text: "Very High", color: "text-green-600" };
    if (confidenceScore >= 0.8) return { text: "High", color: "text-green-500" };
    if (confidenceScore >= 0.7) return { text: "Good", color: "text-blue-500" };
    if (confidenceScore >= 0.6) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "Low", color: "text-orange-500" };
  };
  
  const confidenceLevel = getConfidenceLevel();
  const confidencePercentage = Math.round(confidenceScore * 100);

  const calculateBMI = () => {
    if (!measurements.waist || !measurements.height) return null;
    const estimatedWeight = (measurements.waist * measurements.chest) / 3000;
    const heightInMeters = 1.75;
    return estimatedWeight / (heightInMeters * heightInMeters);
  };
  
  const getWaistToHipRatio = () => {
    if (!measurements.waist || !measurements.hips) return null;
    return measurements.waist / measurements.hips;
  };
  
  const determineGender = (): 'male' | 'female' | 'neutral' => {
    if (!measurements.chest || !measurements.hips) return 'neutral';
    
    const chestHipRatio = measurements.chest / measurements.hips;
    
    if (chestHipRatio > 1.05) return 'male';
    if (chestHipRatio < 0.95) return 'female';
    return 'neutral';
  };
  
  const estimatedGender = determineGender();
  const clothingSizes = getClothingSizeRecommendations(measurements, estimatedGender);
  
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="bg-electric p-6 text-white">
        <h2 className="text-2xl font-bold">Your Body Measurements</h2>
        <p className="opacity-90">Generated with AI precision</p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="space-y-6">
          <Tabs defaultValue="measurements" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="analysis">Analysis & Sizing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="measurements" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Measurements</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info size={18} className="text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          These measurements are calculated using our advanced AI model that
                          analyzes your uploaded images together with your provided height.
                          The model uses machine learning to estimate your measurements based on thousands of reference data points.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Measurement Confidence:</span>
                      <span className={`text-sm font-semibold ${confidenceLevel.color}`}>{confidenceLevel.text}</span>
                    </div>
                    <Progress value={confidencePercentage} className="h-1.5" />
                    <p className="text-xs text-gray-600">
                      Higher confidence means more accurate measurements. Better quality images improve confidence.
                    </p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-gray-900">Measurement</TableHead>
                      <TableHead className="text-right text-gray-900">Centimeters</TableHead>
                      <TableHead className="text-right text-gray-900">Inches</TableHead>
                      <TableHead className="text-right w-10 text-gray-900">Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(measurements).length > 0 ? (
                      Object.entries(measurements).map(([key, value]) => {
                        const inches = cmToInches(value);
                        return (
                          <TableRow key={key} className="border-b border-gray-100">
                            <TableCell className="text-gray-900">{MEASUREMENT_DISPLAY_MAP[key] || key}</TableCell>
                            <TableCell className="text-right font-medium text-gray-900">{value.toFixed(1)} cm</TableCell>
                            <TableCell className="text-right font-medium text-gray-900">{inches.toFixed(1)} in</TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                      <HelpCircle size={15} className="text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <MeasurementAccuracyGuide measurementType={key} />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-red-500 py-4">
                          No measurements available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Size Recommendations</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Ruler size={16} className="text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Size recommendations are based on standard clothing measurements.
                          Actual fit may vary by brand and style. When in doubt, 
                          refer to specific brand size charts.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <p className="text-sm text-gray-700">
                  Based on your measurements, here are clothing size recommendations:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(clothingSizes).map(([category, details]) => (
                    <div key={category} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize text-gray-900">{category}</h4>
                        <Shirt size={16} className="text-electric" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">{details[0]}</span>
                        {details[0].includes('XS') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Extra Small</Badge>}
                        {details[0].includes('S') && !details[0].includes('XS') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Small</Badge>}
                        {details[0].includes('M') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Medium</Badge>}
                        {details[0].includes('L') && !details[0].includes('XL') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Large</Badge>}
                        {details[0].includes('XL') && !details[0].includes('XXL') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Extra Large</Badge>}
                        {details[0].includes('XXL') && <Badge variant="outline" className="text-xs bg-white/80 text-gray-900">Double XL</Badge>}
                      </div>
                      
                      <div className="space-y-1 mt-2">
                        {details.slice(1).map((detail, index) => (
                          <p key={index} className="text-xs text-gray-700">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium pt-4 text-gray-900">Body Composition Analysis</h3>
                <p className="text-sm text-gray-700 mb-3">
                  These estimates are based on your measurements and statistical models:
                </p>
                
                <div className="space-y-3">
                  {getWaistToHipRatio() && (
                    <div className="p-3 border rounded-lg bg-white">
                      <div className="flex justify-between">
                        <span className="text-gray-800">Waist-to-Hip Ratio:</span>
                        <span className="font-medium text-gray-900">{getWaistToHipRatio()?.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Helps estimate body fat distribution
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 border rounded-lg bg-white">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Body Proportions:</span>
                      <span className="font-medium text-gray-900">
                        {measurements.shoulder && measurements.hips && 
                          (measurements.shoulder / measurements.hips > 1.05 ? "Athletic" : 
                           measurements.shoulder / measurements.hips < 0.95 ? "Hourglass" : "Balanced")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on shoulder-to-hip ratio
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
              disabled={Object.entries(measurements).length === 0}
            >
              <Download size={16} />
              Download Results
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleEmailResults}
              disabled={Object.entries(measurements).length === 0}
            >
              <Mail size={16} />
              Email Results
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t bg-gray-50 flex justify-center">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Start a New Scan
        </Button>
      </div>
    </div>
  );
}
