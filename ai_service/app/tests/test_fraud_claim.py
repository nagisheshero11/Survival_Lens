import pytest
from fastapi.testclient import TestClient
from app.routes.claim import router as claim_router
from app.routes.fraud import router as fraud_router
from app.routes.premium import router as premium_router
from fastapi import FastAPI

app = FastAPI()
app.include_router(claim_router)
app.include_router(fraud_router)
app.include_router(premium_router)

client = TestClient(app)


def test_fraud_valid_flow():
    response = client.get(
        "/fraud",
        params={
            "deliveries": 10,
            "hours_active": 5,
            "movement_score": 0.95,
            "route_consistency": 0.93,
            "gps_spoof_score": 0.02,
            "ip_change_count": 0,
            "avg_delivery_value": 11.0,
            "historical_avg_value": 10.5,
            "has_recent_dispute": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["fraud_metrics"]["level"] in ["VALID", "SUSPICIOUS"]


def test_fraud_high_risk_flow():
    response = client.get(
        "/fraud",
        params={
            "deliveries": 15,
            "hours_active": 6,
            "movement_score": 0.42,
            "route_consistency": 0.30,
            "gps_spoof_score": 0.88,
            "ip_change_count": 4,
            "avg_delivery_value": 20.0,
            "historical_avg_value": 8.0,
            "has_recent_dispute": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["fraud_metrics"]["level"] in ["SUSPICIOUS", "FRAUD"]
    assert data["fraud_metrics"]["fraud_risk_score"] >= 40


def test_claim_wallet_credit_reduction_for_fraud_risk():
    response = client.get(
        "/claim",
        params={
            "avg_value": 12.0,
            "deliveries_per_hour": 5,
            "hours_lost": 4,
            "deliveries_today": 12,
            "hours_active_today": 6,
            "movement_score": 0.45,
            "route_consistency": 0.32,
            "gps_spoof_score": 0.91,
            "ip_change_count": 3,
            "historical_avg_value": 8.0,
            "has_recent_dispute": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["claim_status"] in ["REVIEW", "REJECTED", "APPROVED"]
    assert data["wallet_credit"] <= data["estimated_loss"]


def test_premium_calc_extreme():
    response = client.get(
        "/premium",
        params={"weather": 78.4, "zone": 96.7, "activity": 84.1},
    )
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["risk_score"] <= 100
    assert data["weekly_premium"] > 0
