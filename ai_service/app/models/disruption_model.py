def detect_disruption(rain, temp, aqi):
    score = 0

    # Rain
    if rain > 50:
        score += 0.5

    # Temperature
    if temp > 40:
        score += 0.3

    # Pollution
    if aqi > 300:
        score += 0.4

    if score >= 0.5:
        return "HIGH_DISRUPTION"
    elif score >= 0.3:
        return "MODERATE_DISRUPTION"
    else:
        return "NO_DISRUPTION"