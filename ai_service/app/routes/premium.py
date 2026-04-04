from fastapi import APIRouter
from ..services.premium_service import get_premium, get_worker_profile_pricing

router = APIRouter()

@router.get("/premium")
def premium(city: str = None, zone: float = 50.0, activity: float = 50.0):
    return get_premium(city=city, zone=zone, activity=activity)


@router.post("/pricing")
def pricing(payload: dict):
    return get_worker_profile_pricing(payload)