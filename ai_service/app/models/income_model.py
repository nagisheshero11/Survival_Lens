def estimate_hourly_income(avg_delivery_value, deliveries_per_hour):
    return avg_delivery_value * deliveries_per_hour


def calculate_loss(hourly_income, hours_lost):
    return hourly_income * hours_lost