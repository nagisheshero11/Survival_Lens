from app.models.income_model import estimate_hourly_income, calculate_loss
from app.services.fraud_service import check_fraud


def process_claim(
    avg_value,
    deliveries_per_hour,
    hours_lost,
    deliveries_today=0,
    hours_active_today=0.0,
    movement_score=0.85,
    route_consistency=0.8,
    gps_spoof_score=0.0,
    ip_change_count=0,
    historical_avg_value=0.0,
    has_recent_dispute=False,
):
    hourly_income = estimate_hourly_income(avg_value, deliveries_per_hour)
    loss = calculate_loss(hourly_income, hours_lost)

    fraud_data = check_fraud(
        deliveries=deliveries_today,
        hours_active=hours_active_today if hours_active_today > 0 else hours_lost,
        movement_score=movement_score,
        route_consistency=route_consistency,
        gps_spoof_score=gps_spoof_score,
        ip_change_count=ip_change_count,
        avg_delivery_value=avg_value,
        historical_avg_value=historical_avg_value,
        has_recent_dispute=has_recent_dispute,
    )

    fraud_risk = fraud_data["fraud_metrics"]["fraud_risk_score"] / 100.0
    modifier = 1.0 - min(fraud_risk, 0.65)
    wallet_credit = round(loss * modifier, 2)

    if fraud_data["fraud_metrics"]["level"] == "FRAUD":
        claim_status = "REJECTED"
        reason = "Location integrity and behavioral anomaly exceeded fraud threshold."
        adjustment_reason = "100% reduction due to confirmed fraud risk."
    elif fraud_data["fraud_metrics"]["level"] == "SUSPICIOUS":
        claim_status = "REVIEW"
        reason = "Inconsistent activity patterns detected; requires manual review."
        adjustment_reason = "Partial reduction pending review due to elevated risk." 
    else:
        claim_status = "APPROVED"
        reason = "Claim appears consistent with expected worker activity."
        adjustment_reason = "No adjustment needed; claim is consistent with behavior." 

    return {
        "hourly_income": hourly_income,
        "hours_lost": hours_lost,
        "estimated_loss": loss,
        "fraud_evaluation": fraud_data["fraud_metrics"],
        "claim_status": claim_status,
        "claim_reason": reason,
        "loss_adjustment_reason": adjustment_reason,
        "wallet_credit": 0.0 if claim_status == "REJECTED" else wallet_credit
    }