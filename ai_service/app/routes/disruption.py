from fastapi import APIRouter
from pydantic import BaseModel
from app.services.disruption_service import analyze_geospatial_risk

router = APIRouter()

class LocationPayload(BaseModel):
    latitude: float
    longitude: float

@router.post("/v1/analyze/georisk")
def analyze_risk(payload: LocationPayload):
    """
    Endpoint for the Next.js frontend to securely pass the gig worker's coordinates
    and receive real-time, AI-backed disruption status.
    """
    return analyze_geospatial_risk(payload.latitude, payload.longitude)