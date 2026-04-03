from fastapi import APIRouter
from app.services.claim_service import process_claim

router = APIRouter()

@router.get("/claim")
def claim(
    avg_value: float,
    deliveries_per_hour: int,
    hours_lost: int,
    deliveries_today: int = 0,
    hours_active_today: float = 0.0,
    movement_score: float = 0.85,
    route_consistency: float = 0.8,
    gps_spoof_score: float = 0.0,
    ip_change_count: int = 0,
    historical_avg_value: float = 0.0,
    has_recent_dispute: bool = False,
):
    return process_claim(
        avg_value=avg_value,
        deliveries_per_hour=deliveries_per_hour,
        hours_lost=hours_lost,
        deliveries_today=deliveries_today,
        hours_active_today=hours_active_today,
        movement_score=movement_score,
        route_consistency=route_consistency,
        gps_spoof_score=gps_spoof_score,
        ip_change_count=ip_change_count,
        historical_avg_value=historical_avg_value,
        has_recent_dispute=has_recent_dispute,
    )