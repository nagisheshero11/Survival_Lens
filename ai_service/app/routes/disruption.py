from fastapi import APIRouter
from app.services.disruption_service import get_disruption

router = APIRouter()

@router.get("/disruption")
def disruption(rain: float, temp: float, aqi: float):
    return get_disruption(rain, temp, aqi)