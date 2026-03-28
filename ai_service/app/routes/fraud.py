from fastapi import APIRouter
from app.services.fraud_service import check_fraud

router = APIRouter()

@router.get("/fraud")
def fraud(deliveries: int, hours: int, movement: int):
    return check_fraud(deliveries, hours, movement)