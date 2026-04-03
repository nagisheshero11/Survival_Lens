def detect_geo_risk(rain: float, temp: float, windspeed: float) -> dict:
    """
    Computes a composite mathematical risk score isolating the likelihood
    of geospatial disruption (accidents, route delays) for a gig worker.
    """
    risk_score = 0.0
    
    # Heavy Rain / Aquaplaning Risk
    if rain > 3.0: 
        risk_score += (rain * 0.15)
        
    # Lethal Wind Speeds (knocking over two-wheelers)
    if windspeed > 35.0:
        risk_score += 0.4
        
    # Extreme Heatstroke Matrix
    if temp > 37.0:
        risk_score += (temp - 37) * 0.12
    elif temp < 5.0:
        risk_score += (5 - temp) * 0.10

    # Normalize probability into a percentage scale (capped at 99%)
    danger_probability = min(risk_score * 100, 99.0)
    
    if danger_probability > 65:
        level = "CRITICAL"
        action = "activate_buffer"
    elif danger_probability > 25:
        level = "WARNING"
        action = "monitor_velocity"
    else:
        level = "SAFE"
        action = "none"

    return {
        "risk_level": level,
        "action": action,
        "safety_probability": round(100 - danger_probability, 1)
    }