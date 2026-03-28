from fastapi import APIRouter
from app.services.claim_service import process_claim

router = APIRouter()

@router.get("/claim")
def claim(avg_value: float, deliveries_per_hour: int, hours_lost: int):
    return process_claim(avg_value, deliveries_per_hour, hours_lost)