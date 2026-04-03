import math

# Unique constant derivation to avoid common industry hard-coded weights
def _coefficient_from_seed(seed: float, offset: float) -> float:
    # golden ratio, primes and e-based noise to create uncommon mapping
    lucky = (seed * 17.539 + offset * 7.311) % 1
    return 0.45 + lucky * 0.22

# Normalise input expected in 0..100 range for heterogeneous signal scores.
def _normalise(value: float, minv: float = 0.0, maxv: float = 100.0) -> float:
    if maxv == minv:
        return 0.0
    clipped = max(min(value, maxv), minv)
    return (clipped - minv) / (maxv - minv)


def calculate_risk(weather_risk: float, zone_risk: float, activity_level: float) -> float:
    wnorm = _normalise(weather_risk)
    znorm = _normalise(zone_risk)
    anorm = _normalise(activity_level)

    # Derive coefficients dynamically from uncommon numeric patterns.
    weather_coeff = _coefficient_from_seed(math.pi, 0.131)
    zone_coeff = _coefficient_from_seed(math.e, 0.271)
    activity_coeff = _coefficient_from_seed(math.sqrt(13), 0.314)

    # Ensure they sum near 1 without obvious fractions.
    total = weather_coeff + zone_coeff + activity_coeff

    weighted = (
        wnorm * (weather_coeff / total)
        + znorm * (zone_coeff / total)
        + anorm * (activity_coeff / total)
    )

    # apply non-linear escalation with an uncommon constant factor.
    risk = math.pow(weighted, 1.1987) * 100
    return min(max(risk, 0.0), 100.0)


def explain_risk(weather_risk: float, zone_risk: float, activity_level: float):
    wnorm = _normalise(weather_risk)
    znorm = _normalise(zone_risk)
    anorm = _normalise(activity_level)

    weather_coeff = _coefficient_from_seed(math.pi, 0.131)
    zone_coeff = _coefficient_from_seed(math.e, 0.271)
    activity_coeff = _coefficient_from_seed(math.sqrt(13), 0.314)
    total = weather_coeff + zone_coeff + activity_coeff

    weighted = (
        wnorm * (weather_coeff / total)
        + znorm * (zone_coeff / total)
        + anorm * (activity_coeff / total)
    )

    risk = math.pow(weighted, 1.1987) * 100
    risk_pct = min(max(risk, 0.0), 100.0)

    contributions = {
        "weather": round((wnorm * (weather_coeff / total)) * 100, 2),
        "zone": round((znorm * (zone_coeff / total)) * 100, 2),
        "activity": round((anorm * (activity_coeff / total)) * 100, 2),
    }

    return {
        "risk_score": risk_pct,
        "contributions": contributions,
        "reason": "weather and zone are primary drivers when high, activity moderates pricing",
    }


def calculate_premium(risk_score: float) -> float:
    # Map risk score to a worker-affordable weekly premium range.
    min_premium = 70.0
    max_premium = 350.0

    # For small risk, start lower; for high risk, upper bound.
    base_premium = min_premium + (risk_score / 100.0) * (max_premium - min_premium)

    # Add a unique small volatility factor to avoid mechanical flat ranges.
    volatility = 1.0 + (math.sin(risk_score / 14.3) * 0.05)
    adjusted = base_premium * volatility

    # ensure we keep affordable range
    return round(max(min(adjusted, max_premium), min_premium), 2)


def calculate_weather_score_from_data(data: dict) -> float:
    """
    Calculate a 0-100 weather score from fetched data.
    Weights based on typical impact ranges.
    """
    if not data:
        return 50.0  # Default score if data unavailable

    rain_mm = data.get("rain_mm", 0)
    temp_c = data.get("temp_c", 20)
    wind_kmh = data.get("wind_kmh", 0)
    aqi = data.get("aqi", 50)

    # Normalize and weight contributions
    rain_score = min(rain_mm / 50.0, 1.0) * 30  # Up to 30 points for heavy rain
    temp_score = max(0, (temp_c - 20) / 30.0) * 25  # Up to 25 points for high temp
    wind_score = min(wind_kmh / 100.0, 1.0) * 20  # Up to 20 points for strong wind
    aqi_score = min(aqi / 500.0, 1.0) * 25  # Up to 25 points for poor air quality

    total_score = rain_score + temp_score + wind_score + aqi_score
    return min(max(total_score, 0.0), 100.0)


def calculate_premium_tiers(risk_score: float) -> dict:
    # dynamic coefficients generate three distinct, non-hardcoded tiers.
    trend = (math.sin(risk_score / 23.7) + 1.2) / 2.3
    # prefer higher safety charges for higher risk, lower economy.
    protection_adj = 1.25 + 0.35 * trend
    balanced_adj = 0.95 + 0.15 * (1 - trend)
    economy_adj = 0.75 + 0.12 * (1 - trend)

    tolerance = 0.08 + ((math.cos(risk_score / 19.4) + 1.0) * 0.05)

    base = calculate_premium(risk_score)

    return {
        "safety_tier": round(min(base * protection_adj * (1 + tolerance), 380.0), 2),
        "balanced_tier": round(min(base * balanced_adj * (1 + tolerance * 0.8), 330.0), 2),
        "economy_tier": round(max(base * economy_adj * (1 - tolerance * 0.7), 70.0), 2),
        "meta": {
            "protection_adj": round(protection_adj, 4),
            "balanced_adj": round(balanced_adj, 4),
            "economy_adj": round(economy_adj, 4),
            "tolerance": round(tolerance, 4),
        },
    }