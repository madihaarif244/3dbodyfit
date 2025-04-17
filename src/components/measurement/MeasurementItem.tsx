
interface MeasurementItemProps {
  name: string;
  value: number;
  measurementSystem: "metric" | "imperial";
  variant?: "primary" | "secondary";
}

import { formatMeasurement } from "@/utils/formatMeasurements";

export const MeasurementItem = ({ 
  name, 
  value, 
  measurementSystem,
  variant = "primary"
}: MeasurementItemProps) => {
  const bgClass = variant === "primary" ? "bg-gray-800" : "bg-gray-800/70";
  const textClass = variant === "primary" ? "text-lg" : "text-md";
  
  return (
    <div className={`${bgClass} rounded-lg p-3`}>
      <div className={`text-sm text-gray-400`}>{name}</div>
      <div className={`${textClass} font-semibold text-white`}>
        {formatMeasurement(value, measurementSystem)}
      </div>
    </div>
  );
};

