
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

def calculate_image_quality(front_image, side_image=None):
    """Calculate a quality score based on image properties with enhanced criteria."""
    # Check front image quality (resolution, aspect ratio, brightness)
    width, height = front_image.size
    aspect_ratio = width / height if height > 0 else 0
    
    # Calculate resolution quality (0-1)
    resolution_factor = min(1.0, (width * height) / (1000 * 2000))
    
    # Calculate aspect ratio quality (0-1) - closer to 1:2 is better for full body
    optimal_ratio = 0.5
    aspect_quality = 1.0 - min(0.5, abs(aspect_ratio - optimal_ratio))
    
    # Analyze image brightness and contrast
    brightness_quality = analyze_image_brightness(front_image)
    
    # Check if we have a side image (bonus)
    side_image_bonus = 0.25 if side_image else 0  # Increased bonus for side image
    
    # Final quality score with improved weighting
    quality = (resolution_factor * 0.35 + 
               aspect_quality * 0.30 + 
               brightness_quality * 0.15 + 
               side_image_bonus) / (0.8 + (0.2 if side_image else 0))
    
    logger.info(f"Image quality score: {quality:.3f}")
    return quality

def analyze_image_brightness(image):
    """Analyze image brightness for better quality assessment."""
    try:
        # Convert to grayscale for brightness analysis
        if image.mode != 'L':
            grayscale = image.convert('L')
        else:
            grayscale = image
        
        # Calculate histogram
        histogram = grayscale.histogram()
        
        # Calculate brightness metrics
        pixels = sum(histogram)
        brightness = sum(i * x for i, x in enumerate(histogram)) / pixels if pixels > 0 else 0
        
        # Normalize brightness (0-255) to quality score (0-1)
        # Optimal brightness is in the middle range (not too dark, not too bright)
        # Score is highest at middle brightness (127) and lower at extremes
        normalized_brightness = brightness / 255
        brightness_quality = 1.0 - 2.0 * abs(normalized_brightness - 0.5)
        
        return brightness_quality
    
    except Exception as e:
        logger.warning(f"Error analyzing image brightness: {str(e)}")
        return 0.5  # Default to medium quality
