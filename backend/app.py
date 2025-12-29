from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from config import prediction_collection

app = Flask(__name__)
CORS(app)  # Allow frontend requests


# -----------------------------
# CROWD PREDICTION LOGIC
# -----------------------------
def predict_crowd_logic(data):
    score = 0
    reasons = []

    # Route
    if data["route"] == "high":
        score += 3
        reasons.append("Busy route")
    elif data["route"] == "medium":
        score += 2
    else:
        score += 1

    # Time Slot
    if data["time_slot"] == "Peak":
        score += 3
        reasons.append("Peak hour")
    elif data["time_slot"] == "Normal":
        score += 2
    else:
        score += 1

    # Day
    if data["day"] == "weekday":
        score += 2
        reasons.append("Weekday travel")
    else:
        score += 1

    # Weather
    if data["weather"] == "rain":
        score += 2
        reasons.append("Rainy weather")
    elif data["weather"] == "extreme":
        score += 3
        reasons.append("Extreme weather")

    # Holiday
    if data["holiday"] == "yes":
        score -= 2
        reasons.append("Holiday")

    # Event
    if data["event"] == "yes":
        score += 3
        reasons.append("Nearby event")

    # Final crowd level
    if score >= 9:
        level = "HIGH"
    elif score >= 5:
        level = "MEDIUM"
    else:
        level = "LOW"

    return level, score, reasons


# -----------------------------
# API ROUTE: PREDICT CROWD
# -----------------------------
@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.json

    level, score, reasons = predict_crowd_logic(data)

    result = {
        "route": data["route"],
        "time": data["time"],
        "time_slot": data["time_slot"],
        "day": data["day"],
        "weather": data["weather"],
        "holiday": data["holiday"],
        "event": data["event"],
        "crowd_level": level,
        "score": score,
        "reasons": reasons,
        "created_at": datetime.now()
    }

    # Save to MongoDB
    prediction_collection.insert_one(result)

    return jsonify({
        "status": "success",
        "crowd_level": level,
        "score": score,
        "reasons": reasons
    })


# -----------------------------
# API ROUTE: GET HISTORY
# -----------------------------
@app.route("/api/history", methods=["GET"])
def history():
    records = list(prediction_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(10))
    return jsonify(records)


if __name__ == "__main__":
    app.run(debug=True)
