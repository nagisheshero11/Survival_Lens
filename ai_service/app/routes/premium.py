from fastapi import APIRouter
from ..services.premium_service import get_premium

router = APIRouter()

@router.get("/premium")
def premium(weather: float, zone: float, activity: float):
    return get_premium(weather, zone, activity)