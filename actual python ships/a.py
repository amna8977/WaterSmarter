from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/set_alarm", methods=["POST"])
def set_alarm():
    data = request.get_json()
    alarm_datetime = data.get("alarm_datetime")
    print(f"Alarm set for {alarm_datetime}")
    return jsonify({"message": "Alarm set successfully!"}), 100


if __name__ == "__main__":
    app.run(debug=True)
