import os

from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

# ----------------------------------------------------
# CONFIG
# ----------------------------------------------------
DATA_PATH = os.path.join("data", "employees.csv")
MODEL_PATH = os.path.join("model", "attrition_model.pkl")

# If your CSV uses ";" instead of ",", change this:
CSV_SEPARATOR = ","  # if needed: ";"


# ----------------------------------------------------
# APP & MODEL LOADING
# ----------------------------------------------------
app = Flask(__name__)
CORS(app)


print(f"🔄 Loading ML model from {MODEL_PATH} ...")
bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
FEATURE_COLS = bundle["feature_cols"]
print("✅ Model loaded. Using features:", FEATURE_COLS)

print(f"🔄 Loading employee data from {DATA_PATH} ...")
employees_df = pd.read_csv(DATA_PATH, sep=CSV_SEPARATOR)
print("✅ Employee data loaded. Shape:", employees_df.shape)


def compute_risk_scores(df: pd.DataFrame) -> pd.DataFrame:
    """
    Use our trained RandomForest model to compute:
    - riskScore (0–1 probability of attrition)
    - riskLevel (LOW/MEDIUM/HIGH)
    """

    df = df.copy()

    # Drop target columns if present
    for col in ["Attrition", "AttritionFlag"]:
        if col in df.columns:
            df = df.drop(col, axis=1)

    # Align features with training features
    X = df.reindex(columns=FEATURE_COLS, fill_value=0)

    # Predict probability of class 1 (attrition)
    risk_scores = model.predict_proba(X)[:, 1]

    df["riskScore"] = risk_scores
    df["riskLevel"] = np.where(
        risk_scores > 0.7,
        "HIGH",
        np.where(risk_scores > 0.4, "MEDIUM", "LOW")
    )

    return df


# add riskScore & riskLevel to the global dataframe
employees_df = compute_risk_scores(employees_df)
print("✅ Risk scores computed!")


# ----------------------------------------------------
# ROUTES
# ----------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    """Simple health-check."""
    return jsonify(
        {
            "message": "HR Analytics API is running with custom model.",
            "totalEmployees": int(len(employees_df)),
        }
    )


@app.route("/employees", methods=["GET"])
def get_employees():
    """
    Return employees with selected fields and ML risk scores.
    Adapted to your CSV columns.
    """

    # Columns available in your dataset (based on your logs)
    # ['Employee ID', 'Age', 'Gender', 'Years at Company', 'Job Role',
    #  'Monthly Income', 'Number of Promotions', 'Distance from Home',
    #  'Number of Dependents', 'Company Tenure', 'Attrition', 'AttritionFlag', ...]
    display_cols = [
        "Employee ID",
        "Age",
        "Gender",
        "Years at Company",
        "Job Role",
        "Monthly Income",
        "Number of Promotions",
        "Distance from Home",
        "Number of Dependents",
        "Company Tenure",
        "riskScore",
        "riskLevel",
    ]

    # Keep only columns that actually exist in the dataframe
    final_cols = [c for c in display_cols if c in employees_df.columns]

    data = employees_df[final_cols].copy()

    # Convert riskScore to rounded float to avoid huge decimals
    if "riskScore" in data.columns:
        data["riskScore"] = data["riskScore"].round(3)

    records = data.to_dict("records")

    # KPI stats
    total = len(records)
    high_risk = sum(1 for e in records if e.get("riskLevel") == "HIGH")

    stats = {}
    if "Age" in employees_df.columns:
        stats["avgAge"] = round(float(employees_df["Age"].mean()), 1)
    if "Years at Company" in employees_df.columns:
        stats["avgTenure"] = round(float(employees_df["Years at Company"].mean()), 1)
    if "Monthly Income" in employees_df.columns:
        avg_income = round(float(employees_df["Monthly Income"].mean()))
        stats["avgIncome"] = avg_income

    response = {
        "employees": records,
        "total": total,
        "highRisk": high_risk,
        "stats": stats,
    }

    return jsonify(response)


@app.route("/stats", methods=["GET"])
def get_stats():
    """
    Return global risk statistics for the dashboard.
    """
    total = len(employees_df)
    high_risk = int((employees_df["riskLevel"] == "HIGH").sum())
    med_risk = int((employees_df["riskLevel"] == "MEDIUM").sum())
    low_risk = int((employees_df["riskLevel"] == "LOW").sum())

    return jsonify(
        {
            "totalEmployees": int(total),
            "highRiskCount": high_risk,
            "mediumRiskCount": med_risk,
            "lowRiskCount": low_risk,
            "highRiskPercent": round((high_risk / total) * 100, 1)
            if total > 0
            else 0,
            "avgRiskScore": round(float(employees_df["riskScore"].mean()), 3),
        }
    )


@app.route("/predict", methods=["POST"])
def predict_single():
    """
    Predict attrition risk for a single hypothetical employee.
    Frontend sends JSON with numeric features like:
    {
      "Age": 30,
      "Years at Company": 2,
      "Monthly Income": 50000,
      "Number of Promotions": 1,
      "Distance from Home": 10,
      "Number of Dependents": 2,
      "Company Tenure": 3
    }
    """

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload received"}), 400

    df = pd.DataFrame([data])

    # Align with training features
    X = df.reindex(columns=FEATURE_COLS, fill_value=0)

    risk_score = float(model.predict_proba(X)[0][1])
    risk_level = (
        "HIGH" if risk_score > 0.7 else "MEDIUM" if risk_score > 0.4 else "LOW"
    )

    return jsonify(
        {
            "riskScore": round(risk_score, 3),
            "riskLevel": risk_level,
            "confidence": f"{risk_score * 100:.1f}%",
        }
    )


if __name__ == "__main__":
    # Run on port 5000
    app.run(debug=True, port=5000)
