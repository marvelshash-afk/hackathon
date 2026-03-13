from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("model_xgb.pkl")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json["features"]

    prediction = model.predict([data])

    return jsonify({
        "prediction": int(prediction[0])
    })

@app.route("/")
def home():
    return "ThreatZero ML API Running"

app.run(port=5002)