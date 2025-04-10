
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

// Helper function to convert cm to inches
const cmToInches = (cm: number): number => {
  return cm / 2.54;
};

// Helper function to get sizing information based on measurements
const getSizingSuggestion = (measurement: string, value: number, gender: string = "neutral"): string => {
  // These are approximate size ranges - would be more sophisticated in production
  // Update: Fixed the type error by properly typing the arrays with [number, number, string]
  type SizingRange = [number, number, string];
  
  const sizingCharts: Record<string, Record<string, SizingRange[]>> = {
    chest: {
      male: [
        [86, 91, "XS"],
        [91, 96, "S"],
        [96, 101, "M"],
        [101, 106, "L"],
        [106, 111, "XL"],
        [111, 116, "XXL"]
      ],
      female: [
        [81, 86, "XS"],
        [86, 91, "S"],
        [91, 96, "M"],
        [96, 101, "L"],
        [101, 106, "XL"],
        [106, 111, "XXL"]
      ],
      neutral: [
        [84, 89, "XS"],
        [89, 94, "S"], 
        [94, 99, "M"],
        [99, 104, "L"],
        [104, 109, "XL"],
        [109, 114, "XXL"]
      ]
    },
    waist: {
      male: [
        [71, 76, "XS"],
        [76, 81, "S"],
        [81, 86, "M"],
        [86, 91, "L"],
        [91, 96, "XL"],
        [96, 101, "XXL"]
      ],
      female: [
        [61, 66, "XS"],
        [66, 71, "S"],
        [71, 76, "M"],
        [76, 81, "L"],
        [81, 86, "XL"],
        [86, 91, "XXL"]
      ],
      neutral: [
        [66, 71, "XS"],
        [71, 76, "S"],
        [76, 81, "M"],
        [81, 86, "L"],
        [86, 91, "XL"],
        [91, 96, "XXL"]
      ]
    },
    // Could add more detailed sizing charts for other measurements
    default: {
      neutral: [
        [0, Infinity, "Custom fit recommended"]
      ]
    }
  };
  
  // Get appropriate sizing chart
  const chart = sizingCharts[measurement] || sizingCharts.default;
  const sizeRanges = chart[gender] || chart.neutral;
  
  // Find matching size
  for (const [min, max, size] of sizeRanges) {
    if (value >= min && value < max) {
      return size;
    }
  }
  
  return "Custom fit";
};

// Detailed clothing size recommendations based on measurements
const getClothingSizeRecommendations = (measurements: Record<string, number>, gender: string = "neutral"): Record<string, string[]> => {
  const recommendations: Record<string, string[]> = {};
  
  // Tops sizing (based on chest and sometimes shoulders)
  if (measurements.chest) {
    const chestSize = getSizingSuggestion('chest', measurements.chest, gender);
    recommendations.tops = [
      `${chestSize} (${gender === 'female' ? 'Women' : 'Men'}'s)`,
      `Chest: ${measurements.chest.toFixed(1)} cm / ${cmToInches(measurements.chest).toFixed(1)} in`
    ];
    
    // Add specific recommendations for different clothing types
    if (gender === 'male' || gender === 'neutral') {
      if (measurements.chest < 96) recommendations.tops.push('Slim fit recommended');
      else if (measurements.chest > 106) recommendations.tops.push('Regular/relaxed fit recommended');
    } else {
      if (measurements.chest < 86) recommendations.tops.push('Fitted style recommended');
      else if (measurements.chest > 96) recommendations.tops.push('Relaxed fit recommended');
    }
  }
  
  // Bottoms sizing (based on waist and hips)
  if (measurements.waist) {
    const waistSize = getSizingSuggestion('waist', measurements.waist, gender);
    let numericSize = '';
    
    // Convert letter sizes to numeric sizes (approximations)
    if (gender === 'male') {
      switch(waistSize) {
        case 'XS': numericSize = '28-30'; break;
        case 'S': numericSize = '30-32'; break;
        case 'M': numericSize = '32-34'; break;
        case 'L': numericSize = '36-38'; break;
        case 'XL': numericSize = '40-42'; break;
        case 'XXL': numericSize = '44-46'; break;
        default: numericSize = waistSize;
      }
    } else {
      switch(waistSize) {
        case 'XS': numericSize = '0-2'; break;
        case 'S': numericSize = '4-6'; break;
        case 'M': numericSize = '8-10'; break;
        case 'L': numericSize = '12-14'; break;
        case 'XL': numericSize = '16-18'; break;
        case 'XXL': numericSize = '20-22'; break;
        default: numericSize = waistSize;
      }
    }
    
    recommendations.bottoms = [
      `${waistSize} (${numericSize})`,
      `Waist: ${measurements.waist.toFixed(1)} cm / ${cmToInches(measurements.waist).toFixed(1)} in`
    ];
    
    if (measurements.hips) {
      recommendations.bottoms.push(`Hip: ${measurements.hips.toFixed(1)} cm / ${cmToInches(measurements.hips).toFixed(1)} in`);
      
      // Add fit recommendations based on waist-hip ratio
      const waistHipRatio = measurements.waist / measurements.hips;
      if (gender === 'female' && waistHipRatio < 0.8) {
        recommendations.bottoms.push('Curvy fit recommended');
      } else if (gender === 'male' && waistHipRatio > 0.95) {
        recommendations.bottoms.push('Athletic fit recommended');
      }
    }
  }
  
  // Outerwear sizing (often based on chest + allowance for layers)
  if (measurements.chest) {
    // Outerwear typically needs more room
    const outerwearChest = measurements.chest + 5; // Add 5cm for layering
    const outerwearSize = getSizingSuggestion('chest', outerwearChest, gender);
    
    recommendations.outerwear = [
      `${outerwearSize}`,
      `Allow extra room for layering`,
      `Consider ${(gender === 'male' || gender === 'neutral') ? 'sleeve and shoulder width' : 'hip clearance'}`
    ];
  }
  
  // Dress shirts (based on neck and sleeve measurements)
  if (measurements.neck && measurements.sleeve && (gender === 'male' || gender === 'neutral')) {
    const neckInches = cmToInches(measurements.neck).toFixed(1);
    const sleeveInches = cmToInches(measurements.sleeve).toFixed(1);
    
    recommendations.dressShirts = [
      `Neck: ${neckInches}″, Sleeve: ${sleeveInches}″`,
      `Neck: ${measurements.neck.toFixed(1)} cm, Sleeve: ${measurements.sleeve.toFixed(1)} cm`
    ];
  }
  
  // Dress/suit sizing
  if (gender === 'female' && measurements.chest && measurements.waist && measurements.hips) {
    let dressSize = '';
    const chestSize = getSizingSuggestion('chest', measurements.chest, gender);
    
    switch(chestSize) {
      case 'XS': dressSize = '0-2'; break;
      case 'S': dressSize = '4-6'; break;
      case 'M': dressSize = '8-10'; break;
      case 'L': dressSize = '12-14'; break;
      case 'XL': dressSize = '16-18'; break;
      case 'XXL': dressSize = '20-22'; break;
      default: dressSize = 'Custom';
    }
    
    recommendations.dresses = [
      `Size ${dressSize}`,
      `Bust: ${measurements.chest.toFixed(1)} cm / ${cmToInches(measurements.chest).toFixed(1)} in`,
      `Waist: ${measurements.waist.toFixed(1)} cm / ${cmToInches(measurements.waist).toFixed(1)} in`,
      `Hip: ${measurements.hips.toFixed(1)} cm / ${cmToInches(measurements.hips).toFixed(1)} in`
    ];
  }
  
  // Suits and blazers for men
  if (gender === 'male' && measurements.chest) {
    const jacketSize = Math.round(cmToInches(measurements.chest));
    
    recommendations.suits = [
      `Jacket size: ${jacketSize} Regular`,
      `Chest: ${measurements.chest.toFixed(1)} cm / ${cmToInches(measurements.chest).toFixed(1)} in`
    ];
    
    // Add length recommendation based on height
    if (measurements.height) {
      if (measurements.height < 170) {
        recommendations.suits[0] = `Jacket size: ${jacketSize} Short`;
      } else if (measurements.height > 185) {
        recommendations.suits[0] = `Jacket size: ${jacketSize} Long`;
      }
    }
    
    // Add trouser recommendation
    if (measurements.waist) {
      const trouserInches = Math.round(cmToInches(measurements.waist));
      recommendations.suits.push(`Trouser waist: ${trouserInches}″`);
    }
  }
  
  return recommendations;
};

export default function MeasurementResults({ measurements, onReset, confidenceScore = 0.85 }: MeasurementResultsProps) {
  console.log("Rendering MeasurementResults with:", measurements, "confidence:", confidenceScore);
  
  const handleDownload = () => {
    // Create a downloadable text file with measurements in both cm and inches
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
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Measurements Downloaded",
      description: "Your measurements have been saved as a text file.",
    });
  };
  
  const handleEmailResults = () => {
    // In a real app, this would connect to an API to send email
    toast({
      title: "Email Feature",
      description: "In a production app, this would send measurements to your email.",
    });
  };

  // Calculate the confidence level text and color
  const getConfidenceLevel = () => {
    if (confidenceScore >= 0.9) return { text: "Very High", color: "text-green-600" };
    if (confidenceScore >= 0.8) return { text: "High", color: "text-green-500" };
    if (confidenceScore >= 0.7) return { text: "Good", color: "text-blue-500" };
    if (confidenceScore >= 0.6) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "Low", color: "text-orange-500" };
  };
  
  const confidenceLevel = getConfidenceLevel();
  const confidencePercentage = Math.round(confidenceScore * 100);

  // Calculate BMI (basic implementation)
  const calculateBMI = () => {
    if (!measurements.waist || !measurements.height) return null;
    // This is a simplified estimation - actual BMI requires height & weight
    // This is just a placeholder calculation
    const estimatedWeight = (measurements.waist * measurements.chest) / 3000;
    const heightInMeters = 1.75; // Placeholder height
    return estimatedWeight / (heightInMeters * heightInMeters);
  };
  
  // Get waist-to-hip ratio
  const getWaistToHipRatio = () => {
    if (!measurements.waist || !measurements.hips) return null;
    return measurements.waist / measurements.hips;
  };
  
  // Determine gender based on measurements (simplified approach)
  // In a real app, we'd get this from user input
  const determineGender = (): 'male' | 'female' | 'neutral' => {
    if (!measurements.chest || !measurements.hips) return 'neutral';
    
    // This is a very simplified approach for demo purposes
    // A real app would get this from user input
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
                  <h3 className="text-lg font-medium">Measurements</h3>
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
                      <span className="text-sm font-medium">Measurement Confidence:</span>
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
                    <TableRow>
                      <TableHead>Measurement</TableHead>
                      <TableHead className="text-right">Centimeters</TableHead>
                      <TableHead className="text-right">Inches</TableHead>
                      <TableHead className="text-right w-10">Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(measurements).length > 0 ? (
                      Object.entries(measurements).map(([key, value]) => {
                        const inches = cmToInches(value);
                        return (
                          <TableRow key={key}>
                            <TableCell>{MEASUREMENT_DISPLAY_MAP[key] || key}</TableCell>
                            <TableCell className="text-right font-medium">{value.toFixed(1)} cm</TableCell>
                            <TableCell className="text-right font-medium">{inches.toFixed(1)} in</TableCell>
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
                  <h3 className="text-lg font-medium">Size Recommendations</h3>
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
                
                <p className="text-sm text-gray-600">
                  Based on your measurements, here are clothing size recommendations:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(clothingSizes).map(([category, details]) => (
                    <div key={category} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize">{category}</h4>
                        <Shirt size={16} className="text-electric" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold">{details[0]}</span>
                        {details[0].includes('XS') && <Badge variant="outline" className="text-xs">Extra Small</Badge>}
                        {details[0].includes('S') && !details[0].includes('XS') && <Badge variant="outline" className="text-xs">Small</Badge>}
                        {details[0].includes('M') && <Badge variant="outline" className="text-xs">Medium</Badge>}
                        {details[0].includes('L') && !details[0].includes('XL') && <Badge variant="outline" className="text-xs">Large</Badge>}
                        {details[0].includes('XL') && !details[0].includes('XXL') && <Badge variant="outline" className="text-xs">Extra Large</Badge>}
                        {details[0].includes('XXL') && <Badge variant="outline" className="text-xs">Double XL</Badge>}
                      </div>
                      
                      <div className="space-y-1 mt-2">
                        {details.slice(1).map((detail, index) => (
                          <p key={index} className="text-xs text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium pt-4">Body Composition Analysis</h3>
                <p className="text-sm text-gray-600 mb-3">
                  These estimates are based on your measurements and statistical models:
                </p>
                
                <div className="space-y-3">
                  {getWaistToHipRatio() && (
                    <div className="p-3 border rounded-lg bg-white">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Waist-to-Hip Ratio:</span>
                        <span className="font-medium">{getWaistToHipRatio()?.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Helps estimate body fat distribution
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 border rounded-lg bg-white">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Body Proportions:</span>
                      <span className="font-medium">
                        {measurements.shoulder && measurements.hips && 
                          (measurements.shoulder / measurements.hips > 1.05 ? "Athletic" : 
                           measurements.shoulder / measurements.hips < 0.95 ? "Hourglass" : "Balanced")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
