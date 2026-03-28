from app.models.disruption_model import detect_disruption

def get_disruption(rain, temp, aqi):
    event = detect_disruption(rain, temp, aqi)

    return {
        "rain": rain,
        "temperature": temp,
        "aqi": aqi,
        "disruption_level": event
    }