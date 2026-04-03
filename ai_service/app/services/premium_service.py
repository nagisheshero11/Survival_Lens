from ..models.risk_model import calculate_risk, calculate_premium, explain_risk, calculate_premium_tiers, calculate_weather_score_from_data
from ..services.weather_service import fetch_weather_data

def get_premium(city: str = None, zone: float = 50.0, activity: float = 50.0):
    if city:
        weather_data = fetch_weather_data(city)
        weather_score = calculate_weather_score_from_data(weather_data)
    else:
        weather_score = 50.0  # Default if no city

    risk_explanation = explain_risk(weather_score, zone, activity)
    risk_score = risk_explanation["risk_score"]
    standard = calculate_premium(risk_score)
    variants = calculate_premium_tiers(risk_score)

    return {
        "risk_score": risk_score,
        "weather_score": weather_score,
        "weather_data": weather_data if city else None,
        "weekly_premium_standard": standard,
        "weekly_premium_options": variants,
        "contribution_detail": risk_explanation["contributions"],
        "explanation": risk_explanation["reason"]
    }