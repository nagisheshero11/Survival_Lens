from fastapi import APIRouter
from app.services.fraud_service import check_fraud

router = APIRouter()

@router.get("/fraud")
def fraud(
    deliveries: int,
    hours_active: float,
    movement_score: float,
    route_consistency: float = 0.8,
    gps_spoof_score: float = 0.0,
    ip_change_count: int = 0,
    avg_delivery_value: float = 0.0,
    historical_avg_value: float = 0.0,
    has_recent_dispute: bool = False,
):
    return check_fraud(
        deliveries=deliveries,
        hours_active=hours_active,
        movement_score=movement_score,
        route_consistency=route_consistency,
        gps_spoof_score=gps_spoof_score,
        ip_change_count=ip_change_count,
        avg_delivery_value=avg_delivery_value,
        historical_avg_value=historical_avg_value,
        has_recent_dispute=has_recent_dispute,
    )