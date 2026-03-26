def calculate_risk(weather_risk, zone_risk, activity_level):
    return (
        weather_risk * 0.4 +
        zone_risk * 0.3 +
        activity_level * 0.3
    )

def calculate_premium(risk_score):
    base = 20
    multiplier = 10
    return base + (risk_score * multiplier)