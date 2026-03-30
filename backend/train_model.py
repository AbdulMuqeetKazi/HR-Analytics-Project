import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# ---------- CONFIG ----------
DATA_PATH = os.path.join("data", "employees.csv")
MODEL_PATH = os.path.join("model", "attrition_model.pkl")

# If your CSV uses ";" as separator, set this to ";"
CSV_SEPARATOR = ","  # change to ";" if needed


def load_dataset():
    print(f"🔄 Loading dataset from {DATA_PATH} ...")
    df = pd.read_csv(DATA_PATH, sep=CSV_SEPARATOR)
    print("✅ Dataset loaded. Shape:", df.shape)
    print("🔍 First 5 columns:", df.columns.tolist()[:5])
    return df

def prepare_data(df: pd.DataFrame):
    # 1) Ensure Attrition column exists
    if "Attrition" not in df.columns:
        raise ValueError(
            "CSV must contain an 'Attrition' column as target. "
            "Found columns: " + ", ".join(df.columns.astype(str).tolist())
        )

    # 2) Normalize the values in Attrition (to lowercase strings)
    raw = df["Attrition"].astype(str).str.strip().str.lower()

    # 3) Try to map common patterns automatically
    mapping = {
        # binary Yes/No style
        "yes": 1,
        "no": 0,
        "y": 1,
        "n": 0,
        # employment status style
        "left": 1,
        "stay": 0,
        "stayed": 0,
        "active": 0,
        "inactive": 1,
        "terminated": 1,
        "resigned": 1,
        "quit": 1,
        "employed": 0,
        "working": 0,
        "not left": 0,
        # numeric as strings (just in case)
        "1": 1,
        "0": 0,
    }

    df["AttritionFlag"] = raw.map(mapping)

    # 4) Handle unknown values
    unknown_mask = df["AttritionFlag"].isna()
    if unknown_mask.any():
        unknown_count = unknown_mask.sum()
        unique_vals = sorted(raw.unique().tolist())

        print("⚠️ Found", unknown_count, "rows with unknown Attrition values.")
        print("   Unique Attrition values in your CSV:", unique_vals)
        print("   The rows with unknown labels will be DROPPED for training.")

        # Drop rows where mapping failed
        df = df.loc[~unknown_mask].copy()

    # 5) Automatically select numeric feature columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    # Remove target and obvious ID-like columns if present
    drop_cols = []
    for col in ["AttritionFlag", "EmployeeNumber", "EmployeeCount", "StandardHours", "Employee ID"]:
        if col in numeric_cols:
            drop_cols.append(col)

    feature_cols = [c for c in numeric_cols if c not in drop_cols]

    print("✅ Numeric columns found:", numeric_cols)
    print("🚫 Dropping from features:", drop_cols)
    print("✅ Final feature columns used:", feature_cols)

    if not feature_cols:
        raise ValueError("No numeric feature columns found. Check your CSV.")

    X = df[feature_cols].fillna(0)
    y = df["AttritionFlag"]

    return X, y, feature_cols

def train_model(X, y):
    print("🔄 Splitting train/test data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("🔄 Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=35,
        random_state=10,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)
    print("✅ Model training complete.")

    print("📊 Evaluation on test data:")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))

    return model


def save_model(model, feature_cols):
    os.makedirs("model", exist_ok=True)
    bundle = {
        "model": model,
        "feature_cols": feature_cols,
    }
    joblib.dump(bundle, MODEL_PATH)
    print(f"💾 Model saved successfully to {MODEL_PATH}")


def main():
    df = load_dataset()
    X, y, feature_cols = prepare_data(df)
    model = train_model(X, y)
    save_model(model, feature_cols)
    print("🎉 Training pipeline finished without errors.")


if __name__ == "__main__":
    main()
