
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SystemToggleProps {
  measurementSystem: "metric" | "imperial";
  onToggle: () => void;
}

export const SystemToggle = ({ measurementSystem, onToggle }: SystemToggleProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onToggle}
      className="gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
    >
      <ArrowRight className="h-3 w-3" />
      {measurementSystem === "metric" ? "Imperial" : "Metric"}
    </Button>
  );
};

