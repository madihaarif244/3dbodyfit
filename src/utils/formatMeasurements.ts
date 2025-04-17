
export const formatMeasurement = (valueInCm: number, system: "metric" | "imperial") => {
  if (system === "imperial") {
    const inches = valueInCm / 2.54;
    const roundedInches = Math.round(inches * 4) / 4;
    return `${roundedInches.toFixed(1)}"`;
  } else {
    return `${valueInCm.toFixed(1)} cm`;
  }
};

export const formatHeight = (heightInCm: number, system: "metric" | "imperial") => {
  if (system === "imperial") {
    const totalInches = heightInCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  } else {
    return `${heightInCm.toFixed(1)} cm`;
  }
};

