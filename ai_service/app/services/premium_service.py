from ..models.risk_model import calculate_risk, calculate_premium

def get_premium(weather, zone, activity):
    risk = calculate_risk(weather, zone, activity)
    premium = calculate_premium(risk)

    return {
        "risk_score": risk,
        "weekly_premium": premium
    }