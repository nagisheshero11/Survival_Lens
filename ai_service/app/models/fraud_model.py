from sklearn.ensemble import IsolationForest
import numpy as np

# Fraud detection model built using a richer behavioral and location integrity feature set.
training_data = [
    # deliveries, hours_active, movement_score, route_consistency, ip_change_count, session_spike
    [10, 5, 0.92, 0.9, 0, 0.12],
    [12, 6, 0.87, 0.85, 0, 0.09],
    [8, 4, 0.96, 0.88, 0, 0.11],
    [15, 7, 0.78, 0.75, 1, 0.18],
    [9, 5, 0.85, 0.82, 0, 0.14],
    [11, 6, 0.81, 0.79, 1, 0.17],
    [7, 3, 0.95, 0.96, 0, 0.08],
    [13, 6, 0.72, 0.70, 2, 0.22],
]

model = IsolationForest(contamination=0.22, random_state=2897)
model.fit(np.array(training_data))


def _location_integrity_score(gps_spoof_score: float, route_consistency: float, ip_change_count: float) -> float:
    # Inputs in 0..1 range except ip_change_count is non-negative int.
    quality = max(0.0, min(route_consistency, 1.0))
    spoof_penalty = max(0.0, min(gps_spoof_score, 1.0))
    ip_penalty = min(ip_change_count * 0.05, 0.25)

    # Unique weighted combination (non-linear and asymmetric)
    score = (quality * 0.66) - (spoof_penalty * 0.23) - ip_penalty
    return max(0.0, min(score, 1.0))


def _behavior_consistency_score(deliveries: float, hours_active: float, avg_value: float, historical_avg: float) -> float:
    # Worker behavioral context metric; unusual jumps are penalized.
    if hours_active <= 0:
        return 0.0

    efficiency = deliveries / hours_active
    historical_efficiency = historical_avg if historical_avg > 0 else deliveries / max(hours_active, 1)
    trend = np.tanh((efficiency - historical_efficiency) / max(historical_efficiency, 1))

    # Add value-based variance from average delivery earnings.
    value_ratio = min(1.0, avg_value/(historical_avg + 0.01)) if historical_avg >= 0.01 else 1.0
    base_consistency = 0.7 * (1 - abs(trend)) + 0.3 * value_ratio
    return max(0.0, min(base_consistency, 1.0))


def _fraud_risk_from_score(integrity: float, behavior: float, event_flag: bool) -> float:
    core = (1 - integrity) * 0.65 + (1 - behavior) * 0.35
    if event_flag:
        core = min(1.0, core + 0.18)
    # scale to 0..100
    return round(core * 100, 2)


def detect_fraud(deliveries: float,
                 hours_active: float,
                 movement_score: float,
                 route_consistency: float,
                 gps_spoof_score: float,
                 ip_change_count: int,
                 avg_delivery_value: float,
                 historical_avg_value: float,
                 has_recent_dispute: bool = False):
    features = np.array([[
        deliveries,
        hours_active,
        movement_score,
        route_consistency,
        ip_change_count,
        abs(avg_delivery_value - historical_avg_value),
    ]])

    isolation_flag = model.predict(features)[0] == -1

    integrity = _location_integrity_score(gps_spoof_score, route_consistency, ip_change_count)
    behavior = _behavior_consistency_score(deliveries, hours_active, avg_delivery_value, historical_avg_value)
    fraud_risk = _fraud_risk_from_score(integrity, behavior, has_recent_dispute)

    if isolation_flag or fraud_risk >= 75:
        level = "FRAUD"
    elif fraud_risk >= 40 or integrity < 0.55 or behavior < 0.6:
        level = "SUSPICIOUS"
    else:
        level = "VALID"

    return {
        "level": level,
        "fraud_risk_score": fraud_risk,
        "location_integrity_score": round(integrity * 100, 2),
        "behavior_consistency_score": round(behavior * 100, 2),
        "isolation_anomaly": bool(isolation_flag)
    }