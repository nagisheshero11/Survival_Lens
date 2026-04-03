from ..models.risk_model import calculate_risk, calculate_premium, explain_risk, calculate_premium_tiers

def get_premium(weather, zone, activity):
    risk_explanation = explain_risk(weather, zone, activity)
    risk_score = risk_explanation["risk_score"]
    standard = calculate_premium(risk_score)
    variants = calculate_premium_tiers(risk_score)

    return {
        "risk_score": risk_score,
        "weekly_premium_standard": standard,
        "weekly_premium_options": variants,
        "contribution_detail": risk_explanation["contributions"],
        "explanation": risk_explanation["reason"]
    }