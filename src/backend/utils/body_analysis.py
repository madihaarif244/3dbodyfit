
import logging
import numpy as np

logger = logging.getLogger(__name__)

def analyze_body_type_enhanced(image):
    """Enhanced analysis of image to determine body type and proportions."""
    try:
        # Get image width and height
        width, height = image.size
        
        # Convert to numpy array for analysis
        img_array = np.array(image)
        
        # Calculate width to height ratio as basic body type indicator
        width_height_ratio = width / height if height > 0 else 0
        
        # Analyze image content by segments to determine approximate body shape
        # Divide image into upper/middle/lower segments
        upper_segment = img_array[:int(height * 0.33), :, :] if len(img_array.shape) >= 3 else img_array[:int(height * 0.33), :]
        middle_segment = img_array[int(height * 0.33):int(height * 0.66), :, :] if len(img_array.shape) >= 3 else img_array[int(height * 0.33):int(height * 0.66), :]
        lower_segment = img_array[int(height * 0.66):, :, :] if len(img_array.shape) >= 3 else img_array[int(height * 0.66):, :]
        
        # Calculate average brightness in each segment as a proxy for body shape
        try:
            upper_segment_brightness = np.mean(upper_segment)
            middle_segment_brightness = np.mean(middle_segment) 
            lower_segment_brightness = np.mean(lower_segment)
            
            # Calculate segment ratios to approximate body shape
            # Higher values in middle segment may indicate wider waist/torso
            upper_to_middle_ratio = upper_segment_brightness / middle_segment_brightness if middle_segment_brightness > 0 else 1.0
            lower_to_middle_ratio = lower_segment_brightness / middle_segment_brightness if middle_segment_brightness > 0 else 1.0
            
            # Body type factor (0-1, higher = more variation from standard proportions)
            body_type_factor = min(1.0, abs(upper_to_middle_ratio - 1.0) * 0.5 + abs(lower_to_middle_ratio - 1.0) * 0.5)
            
            # Segment prominence indicators
            waist_prominence = 0.5  # Default neutral value
            if upper_to_middle_ratio > 1.1 and lower_to_middle_ratio > 1.1:
                # Middle segment is darker/narrower - could indicate hourglass or athletic shape
                waist_prominence = 0.3  # Narrower waist
            elif upper_to_middle_ratio < 0.9 and lower_to_middle_ratio < 0.9:
                # Middle segment is lighter/wider - could indicate oval/apple shape
                waist_prominence = 0.7  # Wider waist relative to hips/chest
                
        except Exception as e:
            logger.warning(f"Error in segment analysis: {str(e)}")
            body_type_factor = min(0.5, width_height_ratio - 0.5) if width_height_ratio > 0.5 else 0.0
            waist_prominence = 0.5
        
        logger.info(f"Enhanced body analysis: factor={body_type_factor:.2f}, waist={waist_prominence:.2f}, ratio={width_height_ratio:.2f}")
        return {
            "bodyTypeFactor": body_type_factor,
            "waistProminence": waist_prominence,
            "widthToHeightRatio": width_height_ratio
        }
    except Exception as e:
        logger.warning(f"Error analyzing body type: {str(e)}")
        return {
            "bodyTypeFactor": 0.0,
            "waistProminence": 0.5,
            "widthToHeightRatio": 0.5
        }
