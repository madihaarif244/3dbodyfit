
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import Dict, Optional
import logging

# Import from our modularized files
from models.measurement_models import MeasurementRequest, MeasurementResult
from utils.image_processing import calculate_image_quality, analyze_image_brightness
from utils.body_analysis import analyze_body_type_enhanced
from utils.measurement_generator import generate_highly_accurate_measurements

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

@app.get("/")
async def root():
    return {"message": "Welcome to 3DBodyFit API"}

@app.post("/process-measurements", response_model=MeasurementResult)
async def process_measurements(request: MeasurementRequest):
    from services.measurement_service import process_measurement_request
    
    try:
        logger.info(f"Processing measurement request for gender: {request.gender}")
        result = await process_measurement_request(request)
        return result
    
    except Exception as e:
        logger.error(f"Error processing measurements: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing measurements: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
