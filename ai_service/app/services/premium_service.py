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


def _safe_positive_number(value, fallback: float) -> float:
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return fallback
    return parsed if parsed > 0 else fallback


def _clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min(value, max_value), min_value)


def get_worker_profile_pricing(payload: dict):
    avg_weekly_income = _safe_positive_number(payload.get("avgWeeklyIncome"), 8000.0)
    avg_working_hours = _safe_positive_number(payload.get("avgWorkingHours"), 40.0)
    city = (payload.get("city") or "").strip()
    company = (payload.get("company") or "").strip()

    # Formula: basePrice = max(avgWeeklyIncome / avgWorkingHours, 50)
    base_price = max(avg_weekly_income / avg_working_hours, 50.0)
    base_price = _clamp(base_price, 50.0, 5000.0)

    multipliers = {
        "basic": 0.8,
        "standard": 1.0,
        "premium": 1.2,
    }

    plans = []
    for plan_type, multiplier in multipliers.items():
        price = int(round(base_price * multiplier))
        price = max(price, 1)
        benefit_amount = int(round(price * 40))

        plans.append(
            {
                "planType": plan_type,
                "price": price,
                "benefitAmount": benefit_amount,
            }
        )

    return {
        "plans": plans,
        "input": {
            "avgWeeklyIncome": int(round(avg_weekly_income)),
            "avgWorkingHours": round(avg_working_hours, 2),
            "city": city,
            "company": company,
        },
        "formula": {
            "basePrice": round(base_price, 4),
            "description": "basePrice = max(avgWeeklyIncome / avgWorkingHours, 50); price = round(basePrice * multiplier); benefitAmount = price * 40",
        },
        "currency": "INR",
    }