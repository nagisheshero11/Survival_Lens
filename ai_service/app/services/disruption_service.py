from app.models.disruption_model import detect_geo_risk
from app.utils.weather import fetch_live_weather

def analyze_geospatial_risk(lat: float, lon: float) -> dict:
    """
    Core orchestrator: Queries free Open-Meteo API, formats the vectors,
    and pushes them through the AI Disruption Model.
    """
    # 1. Fetch Live Meteorological Data
    weather = fetch_live_weather(lat, lon)
    
    if weather.get("error"):
        return {
            "status": "error", 
            "message": "Meteorological data unavailable"
        }
        
    rain = weather.get("precipitation", 0.0)
    temp = weather.get("temperature", 25.0)
    windspeed = weather.get("windspeed", 0.0)

    # 2. Mathematical AI Evaluation
    risk_assessment = detect_geo_risk(rain, temp, windspeed)

    # 3. Compile Final Intelligence Payload
    return {
        "status": "success",
        "coordinates": {"lat": lat, "lon": lon},
        "live_weather": {
            "temperature_celsius": temp,
            "rain_mm_hr": rain,
            "windspeed_kmh": windspeed
        },
        "ai_analysis": risk_assessment
    }