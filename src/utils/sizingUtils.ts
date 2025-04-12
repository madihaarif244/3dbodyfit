
type ClothingType = 'tshirt' | 'shirt' | 'pants' | 'jacket';
type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom';

/**
 * Calculates recommended clothing sizes based on user measurements
 * @param measurements Body measurements in cm
 * @param gender User gender
 * @returns Object containing recommended sizes for different clothing types
 */
export function calculateClothingSizes(
  measurements: Record<string, number>,
  gender: 'male' | 'female' | 'other' = 'other'
): Record<ClothingType, ClothingSize> {
  // Initialize sizes
  const sizes: Record<ClothingType, ClothingSize> = {
    tshirt: 'M',
    shirt: 'M',
    pants: 'M',
    jacket: 'M'
  };

  // Get key measurements
  const { chest, waist, hips, shoulder } = measurements;

  // Size charts in cm (based on standard size charts)
  const maleChestSizes = {
    'XS': { min: 0, max: 86 },
    'S': { min: 86, max: 94 },
    'M': { min: 94, max: 102 },
    'L': { min: 102, max: 110 },
    'XL': { min: 110, max: 118 },
    'XXL': { min: 118, max: Infinity }
  };

  const femaleChestSizes = {
    'XS': { min: 0, max: 82 },
    'S': { min: 82, max: 88 },
    'M': { min: 88, max: 94 },
    'L': { min: 94, max: 100 },
    'XL': { min: 100, max: 108 },
    'XXL': { min: 108, max: Infinity }
  };

  const maleWaistSizes = {
    'XS': { min: 0, max: 74 },
    'S': { min: 74, max: 82 },
    'M': { min: 82, max: 90 },
    'L': { min: 90, max: 98 },
    'XL': { min: 98, max: 108 },
    'XXL': { min: 108, max: Infinity }
  };

  const femaleWaistSizes = {
    'XS': { min: 0, max: 64 },
    'S': { min: 64, max: 70 },
    'M': { min: 70, max: 78 },
    'L': { min: 78, max: 88 },
    'XL': { min: 88, max: 98 },
    'XXL': { min: 98, max: Infinity }
  };

  const neutralChestSizes = {
    'XS': { min: 0, max: 84 },
    'S': { min: 84, max: 92 },
    'M': { min: 92, max: 100 },
    'L': { min: 100, max: 108 },
    'XL': { min: 108, max: 116 },
    'XXL': { min: 116, max: Infinity }
  };

  const neutralWaistSizes = {
    'XS': { min: 0, max: 70 },
    'S': { min: 70, max: 78 },
    'M': { min: 78, max: 86 },
    'L': { min: 86, max: 96 },
    'XL': { min: 96, max: 106 },
    'XXL': { min: 106, max: Infinity }
  };

  // Choose appropriate size charts based on gender
  const chestSizeChart = gender === 'male' ? maleChestSizes :
                         gender === 'female' ? femaleChestSizes :
                         neutralChestSizes;

  const waistSizeChart = gender === 'male' ? maleWaistSizes :
                         gender === 'female' ? femaleWaistSizes :
                         neutralWaistSizes;

  // Determine upper body clothing sizes (shirts, tshirts, jackets)
  const upperBodySizes: (ClothingSize)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  let upperSize: ClothingSize = 'M';

  for (const size of upperBodySizes) {
    if (chest >= chestSizeChart[size].min && chest < chestSizeChart[size].max) {
      upperSize = size;
      break;
    }
  }

  // For shirts and jackets, also consider shoulder width
  let shirtSize = upperSize;
  if (shoulder) {
    const averageShoulder = gender === 'male' ? 45 : gender === 'female' ? 39 : 42;
    const shoulderDiff = shoulder - averageShoulder;
    
    // Adjust size if shoulders are significantly wider or narrower
    if (shoulderDiff > 4) {
      shirtSize = getNextLargerSize(upperSize);
    } else if (shoulderDiff < -4) {
      shirtSize = getNextSmallerSize(upperSize);
    }
  }

  // Determine lower body clothing sizes (pants)
  const lowerBodySizes: (ClothingSize)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  let lowerSize: ClothingSize = 'M';

  for (const size of lowerBodySizes) {
    if (waist >= waistSizeChart[size].min && waist < waistSizeChart[size].max) {
      lowerSize = size;
      break;
    }
  }

  // Assign calculated sizes to clothing types
  sizes.tshirt = upperSize;
  sizes.shirt = shirtSize;
  sizes.jacket = shirtSize;
  sizes.pants = lowerSize;

  return sizes;
}

/**
 * Helper function to get the next larger size
 */
function getNextLargerSize(size: ClothingSize): ClothingSize {
  const sizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const currentIndex = sizes.indexOf(size);
  
  if (currentIndex >= sizes.length - 1) {
    return 'XXL';
  }
  
  return sizes[currentIndex + 1];
}

/**
 * Helper function to get the next smaller size
 */
function getNextSmallerSize(size: ClothingSize): ClothingSize {
  const sizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const currentIndex = sizes.indexOf(size);
  
  if (currentIndex <= 0) {
    return 'XS';
  }
  
  return sizes[currentIndex - 1];
}

/**
 * Converts a numeric measurement to a descriptive fit
 */
export function getFitDescription(measurement: number, recommendedSize: ClothingSize): string {
  if (recommendedSize === 'XS' || recommendedSize === 'S') {
    return "Slim fit";
  } else if (recommendedSize === 'M') {
    return "Regular fit";
  } else if (recommendedSize === 'L') {
    return "Relaxed fit";
  } else {
    return "Loose fit";
  }
}
