
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { useDevicePreview, DevicePreviewType } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function DevicePreview() {
  const { devicePreview, setDevicePreview } = useDevicePreview();

  const handleDeviceChange = (device: DevicePreviewType) => {
    setDevicePreview(device === devicePreview ? "none" : device);
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50 bg-card p-2 rounded-lg shadow-lg border border-border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={devicePreview === "mobile" ? "default" : "outline"} 
            size="icon" 
            onClick={() => handleDeviceChange("mobile")}
            className="h-8 w-8"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mobile Preview</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={devicePreview === "tablet" ? "default" : "outline"} 
            size="icon" 
            onClick={() => handleDeviceChange("tablet")}
            className="h-8 w-8"
          >
            <Tablet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tablet Preview</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={devicePreview === "none" ? "default" : "outline"} 
            size="icon" 
            onClick={() => setDevicePreview("none")}
            className="h-8 w-8"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Responsive Preview</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
