
import React from 'react';

interface MeasurementAccuracyGuideProps {
  measurementType: string;
}

export function MeasurementAccuracyGuide({ measurementType }: MeasurementAccuracyGuideProps) {
  // Descriptions of how each measurement is taken and its accuracy
  const measurementGuides: Record<string, { description: string; accuracy: string; howToMeasure: string }> = {
    chest: {
      description: "The circumference of the fullest part of the chest",
      accuracy: "±1.5cm with high-quality images",
      howToMeasure: "Measure around the fullest part of your chest, keeping the tape measure horizontal"
    },
    waist: {
      description: "The circumference of the narrowest part of the waist",
      accuracy: "±1.0cm with high-quality images",
      howToMeasure: "Measure around the narrowest part of your waist, usually at the navel level"
    },
    hips: {
      description: "The circumference of the widest part of the hips",
      accuracy: "±1.8cm with high-quality images", 
      howToMeasure: "Measure around the widest part of your hips, over the buttocks"
    },
    shoulder: {
      description: "The linear distance from one shoulder edge to the other",
      accuracy: "±1.2cm with high-quality images",
      howToMeasure: "Measure from the edge of one shoulder to the other across your back"
    },
    sleeve: {
      description: "The length from shoulder to wrist",
      accuracy: "±1.0cm with high-quality images",
      howToMeasure: "Measure from the edge of the shoulder to the wrist bone"
    },
    neck: {
      description: "The circumference of the neck where a collar would sit",
      accuracy: "±0.8cm with high-quality images",
      howToMeasure: "Measure around the middle of the neck, where a collar would sit"
    },
    thigh: {
      description: "The circumference of the upper leg at its widest point",
      accuracy: "±1.5cm with high-quality images",
      howToMeasure: "Measure around the widest part of your upper thigh"
    },
    inseam: {
      description: "The distance from the crotch to the ankle bone",
      accuracy: "±2.0cm with high-quality images",
      howToMeasure: "Measure from the crotch seam to just below the ankle bone"
    },
    default: {
      description: "Body measurement",
      accuracy: "±2.0cm with high-quality images",
      howToMeasure: "Follow standard measurement practices"
    }
  };

  const guide = measurementGuides[measurementType] || measurementGuides.default;

  return (
    <div className="max-w-[250px] text-xs space-y-2">
      <p className="font-medium">{guide.description}</p>
      <p>Typical accuracy: {guide.accuracy}</p>
      <div>
        <span className="font-medium">How to measure:</span>
        <p className="text-gray-600">{guide.howToMeasure}</p>
      </div>
    </div>
  );
}
