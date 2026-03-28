from sklearn.ensemble import IsolationForest
import numpy as np

# Training data (normal behavior simulation)
training_data = [
    [10, 5, 2],   # deliveries, hours, movement score
    [12, 6, 3],
    [8, 4, 2],
    [15, 7, 4],
    [9, 5, 2],
]

model = IsolationForest(contamination=0.2)
model.fit(training_data)


def detect_fraud(deliveries, hours, movement):
    sample = np.array([[deliveries, hours, movement]])
    result = model.predict(sample)

    if result[0] == -1:
        return "FRAUD"
    else:
        return "VALID"