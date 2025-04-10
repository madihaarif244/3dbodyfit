
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import base64
import io
from PIL import Image
import numpy as np
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="3DBodyFit API", description="API for 3D body measurements")

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MeasurementRequest(BaseModel):
    gender: str
    height: str
    measurementSystem: str
    frontImageBase64: str
    sideImageBase64: str

class MeasurementResult(BaseModel):
    measurements: Dict[str, float]
    confidence: float

@app.get("/")
async def root():
    return {"message": "Welcome to 3DBodyFit API"}

@app.post("/process-measurements", response_model=MeasurementResult)
async def process_measurements(request: MeasurementRequest):
    try:
        logger.info(f"Processing measurement request for gender: {request.gender}")
        
        # Convert base64 images to PIL Images
        front_image = Image.open(io.BytesIO(base64.b64decode(request.frontImageBase64.split(',')[1])))
        side_image = Image.open(io.BytesIO(base64.b64decode(request.sideImageBase64.split(',')[1])))
        
        # Save images temporarily (optional)
        front_image.save("temp_front.jpg")
        side_image.save("temp_side.jpg")
        
        # Process the images and calculate measurements
        # This is where you'd integrate your AI model
        # For now, we'll return mock data based on inputs
        
        # Convert height to cm for consistency
        height_cm = float(request.height)
        if request.measurementSystem == "imperial":
            height_cm = height_cm * 2.54  # Convert inches to cm
            
        # Mock confidence calculation based on image dimensions
        front_quality = min(1.0, front_image.width * front_image.height / (1000 * 2000))
        side_quality = min(1.0, side_image.width * side_image.height / (1000 * 2000))
        confidence = (front_quality + side_quality) / 2
        
        # Generate mock measurements based on height and gender
        # In a real implementation, this would use your AI model
        measurements = generate_mock_measurements(request.gender, height_cm)
        
        # Clean up temporary files
        if os.path.exists("temp_front.jpg"):
            os.remove("temp_front.jpg")
        if os.path.exists("temp_side.jpg"):
            os.remove("temp_side.jpg")
            
        return {
            "measurements": measurements,
            "confidence": min(0.95, confidence)
        }
    
    except Exception as e:
        logger.error(f"Error processing measurements: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing measurements: {str(e)}")

def generate_mock_measurements(gender: str, height_cm: float):
    """Generate mock measurements based on height and gender."""
    # These are simplified calculations based on average body proportions
    # In production, you would replace this with actual model predictions
    
    # Base scaling factors for different body parts based on height
    if gender == "male":
        chest = height_cm * 0.52
        waist = height_cm * 0.45
        hips = height_cm * 0.51
        inseam = height_cm * 0.48
        shoulder = height_cm * 0.23
        sleeve = height_cm * 0.33
        neck = height_cm * 0.19
        thigh = height_cm * 0.29
    elif gender == "female":
        chest = height_cm * 0.51
        waist = height_cm * 0.41
        hips = height_cm * 0.55
        inseam = height_cm * 0.47
        shoulder = height_cm * 0.21
        sleeve = height_cm * 0.30
        neck = height_cm * 0.16
        thigh = height_cm * 0.31
    else:  # other
        chest = height_cm * 0.515
        waist = height_cm * 0.43
        hips = height_cm * 0.53
        inseam = height_cm * 0.475
        shoulder = height_cm * 0.22
        sleeve = height_cm * 0.315
        neck = height_cm * 0.175
        thigh = height_cm * 0.30
    
    # Add slight random variation (±5%)
    import random
    variation = lambda x: x * (1 + (random.random() * 0.1 - 0.05))
    
    return {
        "chest": round(variation(chest), 1),
        "waist": round(variation(waist), 1),
        "hips": round(variation(hips), 1),
        "inseam": round(variation(inseam), 1),
        "shoulder": round(variation(shoulder), 1),
        "sleeve": round(variation(sleeve), 1),
        "neck": round(variation(neck), 1),
        "thigh": round(variation(thigh), 1),
        "height": height_cm
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
