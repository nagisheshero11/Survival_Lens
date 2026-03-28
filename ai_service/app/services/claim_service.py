from app.models.income_model import estimate_hourly_income, calculate_loss

def process_claim(avg_value, deliveries_per_hour, hours_lost):
    hourly_income = estimate_hourly_income(avg_value, deliveries_per_hour)
    loss = calculate_loss(hourly_income, hours_lost)

    return {
        "hourly_income": hourly_income,
        "hours_lost": hours_lost,
        "estimated_loss": loss,
        "wallet_credit": loss  # full credit for now
    }