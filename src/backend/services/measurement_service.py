
import base64
import io
import os
import logging
from PIL import Image

# Import from our utility modules
from utils.image_processing import calculate_image_quality
from utils.body_analysis import analyze_body_type_enhanced
from utils.measurement_generator import generate_highly_accurate_measurements
from models.measurement_models import MeasurementRequest, MeasurementResult

logger = logging.getLogger(__name__)

async def process_measurement_request(request: MeasurementRequest):
    """Process measurement request and generate results based on provided images"""
    # Convert base64 images to PIL Images
    front_image = Image.open(io.BytesIO(base64.b64decode(request.frontImageBase64.split(',')[1])))
    
    side_image = None
    if request.sideImageBase64:
        side_image = Image.open(io.BytesIO(base64.b64decode(request.sideImageBase64.split(',')[1])))
    
    # Save images temporarily (optional)
    front_image.save("temp_front.jpg")
    if side_image:
        side_image.save("temp_side.jpg")
    
    # Convert height to cm for consistency
    height_cm = float(request.height)
    if request.measurementSystem == "imperial":
        height_cm = height_cm * 2.54  # Convert inches to cm
        
    # Calculate confidence based on image quality and availability
    image_quality = calculate_image_quality(front_image, side_image)
    confidence = min(0.98, 0.88 + image_quality * 0.15)  # Increased base confidence
    
    # Analyze body type from front image (enhanced version)
    body_type_data = analyze_body_type_enhanced(front_image)
    
    # Generate improved measurements with enhanced accuracy
    measurements = generate_highly_accurate_measurements(
        request.gender, 
        height_cm, 
        side_image is not None, 
        body_type_data
    )
    
    # Clean up temporary files
    if os.path.exists("temp_front.jpg"):
        os.remove("temp_front.jpg")
    if os.path.exists("temp_side.jpg") and side_image:
        os.remove("temp_side.jpg")
        
    return MeasurementResult(
        measurements=measurements,
        confidence=confidence
    )
