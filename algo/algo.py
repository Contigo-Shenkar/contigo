import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from make_prediction import predict_and_update_model
from utils import get_conditions, get_medication

app = Flask(__name__)
print("__name__", __name__)
CORS(app)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test endpoint working"})

@app.route('/predict', methods=['POST'])
def predict():
    prediction_info = request.get_json()
    print("prediction_info", prediction_info)
    response = predict_and_update_model(prediction_info)
    return jsonify(response)

@app.route('/conditions', methods=['GET'])
def api_get_conditions():
    conditions = get_conditions()
    return jsonify(conditions)

@app.route('/medications/<string:condition>', methods=['GET'])
def api_get_medications(condition):
    medications = get_medication(condition)
    return jsonify(medications)

if __name__ == '__main__':
    app.run(debug=True)