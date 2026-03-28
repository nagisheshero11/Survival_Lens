from sklearn.ensemble import IsolationForest
import numpy as np

# Better training data (include variety)
training_data = [
    [10, 5, 2],
    [12, 6, 3],
    [8, 4, 2],
    [15, 7, 4],
    [9, 5, 2],
    [11, 6, 3],
    [7, 3, 1],
    [13, 6, 3],
]

model = IsolationForest(contamination=0.3)  # increase sensitivity
model.fit(training_data)


def detect_fraud(deliveries, hours, movement):
    sample = np.array([[deliveries, hours, movement]])
    result = model.predict(sample)

    if result[0] == -1:
        return "FRAUD"
    else:
        return "VALID"