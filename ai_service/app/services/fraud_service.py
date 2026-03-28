from app.models.fraud_model import detect_fraud

def check_fraud(deliveries, hours, movement):
    status = detect_fraud(deliveries, hours, movement)

    return {
        "deliveries": deliveries,
        "hours": hours,
        "movement": movement,
        "fraud_status": status
    }