
from pydantic import BaseModel
from typing import Dict, Optional, List

class MeasurementRequest(BaseModel):
    gender: str
    height: str
    measurementSystem: str
    frontImageBase64: str
    sideImageBase64: Optional[str] = None

class MeasurementResult(BaseModel):
    measurements: Dict[str, float]
    confidence: float

class BodyTypeData(BaseModel):
    bodyTypeFactor: float
    waistProminence: float
    widthToHeightRatio: float
