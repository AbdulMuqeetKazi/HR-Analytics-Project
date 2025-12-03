# HR Analytics Dashboard – Employee Risk Prediction (Attrition & Layoff)

This project is a **full-stack HR analytics system** that predicts **employee risk** using Machine Learning and visualizes insights through a modern web dashboard.

The system focuses on **Technology employees** and helps HR teams identify workers who are at **high risk of attrition or potential layoff**, based on historical HR data and key features like age, tenure, income, promotions, dependents, and distance from home.

> Built as a VTU 5th semester CSE mini-project  

---

## 🚀 Features

### 1. HR Analytics Dashboard (Frontend)

- Clean **light-themed UI** with login and sidebar navigation.
- **Analytics Dashboard**:
  - High-risk employees count
  - Total Technology employees
  - Average tenure (years at company)
  - Unique job roles (all grouped as “Technology” for this MVP)
- **Risk Heatmap**:
  - Scrollable list of top high-risk employees with colored badges (Low / Medium / High).
- **Charts & Visualizations** (using Chart.js):
  - Technology attrition/risk trend
  - Risk distribution (Low / Medium / High) doughnut chart
- **Employee Profiles Page**:
  - Table of Technology employees with ID, name, age, tenure, and risk level.
  - Search by ID, name, or “Technology”.
  - Filter employees by risk level (All, Low, Medium, High).
  - “View” action → opens detailed employee profile panel.
  - “Predict” action → calls backend API to refresh ML risk score.
- **Reports & Settings Pages**:
  - Simple reports summarizing Technology headcount and high-risk segment.
  - Settings page to change display name shown in the sidebar.

---

### 2. Backend REST API (Flask)

- Built using **Flask** with **CORS enabled** for frontend–backend communication.
- Loads a trained **RandomForest** ML model from disk.
- Calculates **riskScore (0–1)** and **riskLevel (Low / Medium / High)** for each employee.
- Precomputes and serves key statistics used in the dashboard.

**Key Endpoints:**

1. `GET /`  
   Health-check endpoint. Can return a simple message + total employees.

2. `GET /employees`  
   - Returns the full list of employees as JSON.  
   - Each employee includes selected features + `riskScore` and `riskLevel`.

3. `GET /stats`  
   - Returns aggregate metrics for the dashboard (e.g., total employees, high-risk count, average tenure, etc.).

4. `POST /predict`  
   - Accepts JSON with employee features.  
   - Returns predicted `riskScore` and `riskLevel` for that specific employee.  
   - Used by the “Predict” buttons in the frontend.

---

### 3. Machine Learning Model

- Implemented in **Python** using **scikit-learn**.
- Model type: **RandomForestClassifier**
- Input features (numeric):
  - `Age`
  - `Years at Company`
  - `Monthly Income`
  - `Number of Promotions`
  - `Distance from Home`
  - `Number of Dependents`
  - `Company Tenure`
- Target:
  - `AttritionFlag` (0 = no attrition, 1 = attrition)
- The same risk probability is interpreted as **overall employee risk**, helpful for both:
  - **Attrition risk** (chance of resignation)
  - **Layoff risk** (employee likely to fall into a vulnerable group)

The model is trained once using **`train_model.py`**, evaluated, and then saved as:

```bash
model/attrition_model.pkl


###  🧱 Project Structure

hr-analytics-dashboard/
├── backend/
│   ├── app.py                 # Flask backend API
│   ├── train_model.py         # ML training script
│   ├── requirements.txt       # Backend Python dependencies
│   ├── data/
│   │   └── employees.csv      # HR dataset (Technology-focused)
│   └── model/
│       └── attrition_model.pkl # Trained RandomForest model
│
└── frontend/
    ├── index.html             # Main dashboard interface
    ├── styles.css             # All UI styling (light theme)
    └── app.js                 # Frontend logic, API calls, charts & interactions


###  🛠️  Tech Stack

Machine Learning & Backend:

Python 3.x
scikit-learn
pandas, numpy
Flask, flask-cors
joblib (for model saving/loading)
Frontend
HTML5, CSS3
Vanilla JavaScript (no framework needed)
Chart.js (for charts & graphs)

Tools:

VS Code (with Live Server extension)
Any modern browser (Chrome / Edge / Firefox)

###  ⚙️  Installation & Setup:

1. Clone the repository
git clone <your-repo-url>.git
cd hr-analytics-dashboard

2. Set up Python virtual environment (recommended)
From the backend folder:
cd backend

# create virtual environment
python -m venv venv
# activate (Windows)
venv\Scripts\activate
# or (Linux/Mac)
# source venv/bin/activate

3. Install backend dependencies:

pip install -r requirements.txt
(If requirements.txt is not present, install manually:)
pip install flask flask-cors scikit-learn pandas numpy joblib

4. Train the ML model (one-time):

Make sure data/employees.csv is in place, then run:
python train_model.py
You should see console output with dataset shape, columns, training logs and final metrics.
A file model/attrition_model.pkl will be created on success.

5. Run the Flask backend:

python app.py
Backend will start on:
http://127.0.0.1:5000
Keep this terminal running.

6. Run the Frontend

Go to the frontend folder:
cd ../frontend
Open index.html:
Easiest: open with Live Server extension from VS Code
Or just double-click index.html to open in browser (if CORS / path issues are handled)
The dashboard should now load and automatically call the backend APIs.

###  🧭  How the System Works (End-to-End Flow)

1. Model Training

train_model.py:
Reads data/employees.csv
Maps Attrition column → AttritionFlag (0/1)
Selects numeric features
Splits into train/test
Trains RandomForestClassifier
Evaluates metrics
Saves model as attrition_model.pkl

2. Backend Startup

app.py:
Loads attrition_model.pkl
Loads employees.csv
Computes riskScore and riskLevel for each employee using predict_proba
Prepares summary statistics for /stats
Exposes REST endpoints using Flask

3. Frontend Dashboard

index.html + styles.css render the layout (login, sidebar, dashboard cards, heatmap, charts, profiles).
app.js:
On page load, calls /stats and /employees
Populates KPI cards, heatmap, charts, table, and profile details
Handles search, filtering, and “Predict” button events
Sends POST /predict with employee features to update risk on demand

### 🔍 API Reference (Short)

GET /stats
Returns aggregated metrics for dashboard cards. Example:

json
{
  "total_employees": 74498,
  "high_risk_count": 28196,
  "average_tenure": 15.7
}
GET /employees
Returns list of employees with risk information:

json
[
  {
    "Employee ID": 52685,
    "Name": "Employee 52685",
    "Age": 36,
    "Years at Company": 13,
    "Monthly Income": 8029,
    "Company Tenure": 22,
    "Job Role": "Technology",
    "riskScore": 0.20,
    "riskLevel": "LOW"
  },
  ...
]
POST /predict
Request body:

json
{
  "Age": 29,
  "Years at Company": 3,
  "Monthly Income": 54000,
  "Number of Promotions": 1,
  "Distance from Home": 15,
  "Number of Dependents": 2,
  "Company Tenure": 4
}
Response:

json
{
  "riskScore": 0.72,
  "riskLevel": "HIGH"
}

###  📊  Model & Risk Interpretation:

The ML model outputs a probability p between 0 and 1.
This is interpreted as employee risk, which HR can read as:
Likelihood of attrition (resignation)
Combined vulnerability that may also indicate layoff risk

Risk levels:
Probability Range	Risk Level
0.00 – 0.39	LOW
0.40 – 0.69	MEDIUM
0.70 – 1.00	HIGH
The dashboard uses these levels to color badges and heatmap entries.

### ⚠  Limitations

Dataset is static (CSV file) – no live database integration yet.
Authentication on login is simulated (any email/password works).
Risk is trained primarily on attrition labels; layoff risk is interpreted conceptually from the same risk scoring.
Accuracy is ~56% (F1 ~0.55), which is reasonable for a behavioral HR problem, but not production-grade.

###  👥  Contributors

— Abdul Muqeet F Kazi
— Basavaraj M Soorangimath
— Mohammed Haris Ansari
— Gourav Sunil Popale
