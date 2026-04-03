from fastapi import APIRouter
from ..services.premium_service import get_premium

router = APIRouter()

@router.get("/premium")
def premium(city: str = None, zone: float = 50.0, activity: float = 50.0):
    return get_premium(city=city, zone=zone, activity=activity)