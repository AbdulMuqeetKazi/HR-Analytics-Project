// ===============================
// CONFIG
// ===============================
const API_BASE = "http://127.0.0.1:5000";

// ===============================
// ELEMENTS
// ===============================
const loginPage = document.getElementById("login-page");
const mainApp = document.getElementById("main-app");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const roleSelect = document.getElementById("role-select");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const displayUsername = document.getElementById("display-username");
const logoutBtn = document.getElementById("logout-btn");

const sectionTitle = document.getElementById("section-title");
const sidebarItems = document.querySelectorAll(".sidebar-nav li");
const sections = document.querySelectorAll(".section");

const searchInput = document.getElementById("search-input");
const refreshBtn = document.getElementById("refresh-btn");

const toastEl = document.getElementById("toast");
const loadingOverlay = document.getElementById("loading-overlay");

// KPI
const totalEmployeesEl = document.getElementById("total-employees");
const highRiskEl = document.getElementById("high-risk");
const highRiskPercentEl = document.getElementById("high-risk-percent");
const avgYearsEl = document.getElementById("avg-years");
const deptCountEl = document.getElementById("total-departments");

// Heatmap
const heatmapList = document.getElementById("heatmap-list");

// Employee table / details
const employeesTableBody = document.querySelector("#employee-table tbody");
const employeeEmptyState = document.getElementById("employee-empty-state");
const employeeDetailsPanel = document.getElementById("employee-details-panel");
const riskFilterSelect = document.getElementById("risk-filter");

// Reports
const reportsTableBody = document.querySelector("#reports-table tbody");
const highRiskRoleTableBody = document.querySelector(
  "#high-risk-role-table tbody"
);

// Settings
const displayNameInput = document.getElementById("display-name-input");
const saveDisplayNameBtn = document.getElementById("save-display-name");
const saveMsg = document.getElementById("save-msg");

// ===============================
// STATE
// ===============================
let employees = [];
let filteredEmployees = [];
let deptChart = null;
let riskChart = null;

// ===============================
// UTILITIES
// ===============================
function showToast(msg, type = "info") {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.style.borderColor =
    type === "error" ? "#dc2626" : type === "success" ? "#16a34a" : "#d1d5db";
  toastEl.classList.add("show");
  toastEl.classList.remove("hidden");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function showLoading(show) {
  loadingOverlay.classList.toggle("hidden", !show);
}

function getRiskClass(level) {
  const v = String(level || "").toUpperCase();
  if (v === "HIGH") return "high";
  if (v === "MEDIUM") return "medium";
  return "low";
}

// ===============================
// LOGIN
// ===============================
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleSelect.value;

  if (!email || !password) {
    loginError.textContent = "Please enter email and password.";
    return;
  }
  loginError.textContent = "";

  // simple demo login: accept any credentials
  displayUsername.textContent = role || "HR Manager";

  loginPage.classList.add("hidden");
  mainApp.classList.remove("hidden");

  await initApp();
});

logoutBtn.addEventListener("click", () => {
  mainApp.classList.add("hidden");
  loginPage.classList.remove("hidden");
  showToast("Signed out.", "info");
});

// ===============================
// NAVIGATION
// ===============================
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const targetSection = item.dataset.section;
    sections.forEach((sec) => sec.classList.add("hidden"));
    const secEl = document.getElementById(`${targetSection}-section`);
    if (secEl) secEl.classList.remove("hidden");

    if (targetSection === "dashboard") {
      sectionTitle.textContent = "Analytics Dashboard";
    } else if (targetSection === "employees") {
      sectionTitle.textContent = "Employee Profiles";
    } else if (targetSection === "reports") {
      sectionTitle.textContent = "Reports";
    } else {
      sectionTitle.textContent = "Settings";
    }
  });
});

// ===============================
// BACKEND FETCH
// ===============================
async function loadEmployeesFromBackend() {
  try {
    showLoading(true);
    const res = await fetch(`${API_BASE}/employees`);
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    const data = await res.json();

    const list = data.employees || [];

    // Map backend data -> frontend model
    // IMPORTANT: we FORCE all jobRole to "Technology" to hide other roles
    employees = list.map((e, idx) => {
      const id = e["Employee ID"] ?? idx + 1;
      return {
        id,
        name: `Employee ${id}`,
        jobRole: "Technology", // <- always Technology in frontend
        gender: e["Gender"] ?? "Unknown",
        age: e["Age"] ?? null,
        yearsAtCompany: e["Years at Company"] ?? null,
        monthlyIncome: e["Monthly Income"] ?? null,
        promotions: e["Number of Promotions"] ?? null,
        distanceFromHome: e["Distance from Home"] ?? null,
        dependents: e["Number of Dependents"] ?? null,
        companyTenure: e["Company Tenure"] ?? null,
        riskScore: typeof e["riskScore"] === "number" ? e["riskScore"] : 0,
        riskLevel: e["riskLevel"] ?? "LOW",
      };
    });

    filteredEmployees = [...employees];

    updateDashboard(data);
    renderHeatmap();
    renderEmployeesTable();
    renderReports();

    if (filteredEmployees.length > 0) {
      showEmployeeDetails(filteredEmployees[0]);
    }

    showToast("Technology data loaded from ML backend.", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to load data from backend.", "error");
  } finally {
    showLoading(false);
  }
}

// ===============================
// DASHBOARD
// ===============================
function updateDashboard(backendData) {
  const total = backendData?.total ?? employees.length;
  totalEmployeesEl.textContent = total;

  const highRiskFromBackend = backendData?.highRisk;
  const highRisk =
    typeof highRiskFromBackend === "number"
      ? highRiskFromBackend
      : employees.filter((e) => e.riskLevel === "HIGH").length;
  highRiskEl.textContent = highRisk;

  const highRiskPercent = total > 0 ? (highRisk / total) * 100 : 0;
  highRiskPercentEl.textContent = `${highRiskPercent.toFixed(1)}%`;

  const backendTenure = backendData?.stats?.avgTenure;
  const avgTenure =
    backendTenure ??
    (employees.reduce((s, e) => s + (e.yearsAtCompany || 0), 0) /
      (employees.length || 1));
  avgYearsEl.textContent = avgTenure ? avgTenure.toFixed(1) : "0";

  // job roles: always 1 (Technology)
  deptCountEl.textContent = 1;

  updateCharts();
}

function renderHeatmap() {
  if (!heatmapList) return;

  heatmapList.innerHTML = "";

  // sort by riskScore desc, take top 8
  const top = [...employees]
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 8);

  top.forEach((emp) => {
    const li = document.createElement("li");

    const dotClass =
      getRiskClass(emp.riskLevel) === "high"
        ? "dot-high"
        : getRiskClass(emp.riskLevel) === "medium"
        ? "dot-medium"
        : "dot-low";

    const percent = emp.riskScore ? Math.round(emp.riskScore * 100) : 0;

    li.innerHTML = `
      <div class="heatmap-left">
        <div class="heatmap-dot ${dotClass}"></div>
        <div>
          <div class="heatmap-name">${emp.name}</div>
          <div class="heatmap-role">Technology · ${emp.id}</div>
        </div>
      </div>
      <div class="heatmap-risk">${percent}% risk</div>
    `;

    heatmapList.appendChild(li);
  });
}

function updateCharts() {
  const ctxBar = document.getElementById("barChart").getContext("2d");
  const ctxDoughnut = document.getElementById("doughnutChart").getContext("2d");

  // For bar chart, we simulate attrition trend using simple buckets
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const base = employees.length / 6;
  const counts = months.map((_, i) =>
    Math.round(base + Math.sin(i / 2) * (base * 0.2))
  );

  if (deptChart) deptChart.destroy();
  deptChart = new Chart(ctxBar, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Technology Employees",
          data: counts,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });

  // Risk distribution
  const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  employees.forEach((emp) => {
    const r = String(emp.riskLevel || "LOW").toUpperCase();
    if (r === "HIGH") riskCounts.HIGH++;
    else if (r === "MEDIUM") riskCounts.MEDIUM++;
    else riskCounts.LOW++;
  });

  if (riskChart) riskChart.destroy();
  riskChart = new Chart(ctxDoughnut, {
    type: "doughnut",
    data: {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          data: [riskCounts.LOW, riskCounts.MEDIUM, riskCounts.HIGH],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      cutout: "65%",
    },
  });
}

// ===============================
// EMPLOYEES TABLE & FILTERS
// ===============================
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const riskFilter = riskFilterSelect.value.toUpperCase();

  filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !searchTerm ||
      String(emp.id).includes(searchTerm) ||
      (emp.name && emp.name.toLowerCase().includes(searchTerm));

    const matchesRisk =
      riskFilter === "ALL" ||
      String(emp.riskLevel || "LOW").toUpperCase() === riskFilter;

    return matchesSearch && matchesRisk;
  });

  renderEmployeesTable();
}

searchInput.addEventListener("input", applyFilters);
riskFilterSelect.addEventListener("change", applyFilters);

function renderEmployeesTable() {
  employeesTableBody.innerHTML = "";

  if (!filteredEmployees.length) {
    employeeEmptyState.classList.remove("hidden");
    return;
  }
  employeeEmptyState.classList.add("hidden");

  filteredEmployees.forEach((emp) => {
    const tr = document.createElement("tr");
    const riskClass = getRiskClass(emp.riskLevel);
    const riskLabel = String(emp.riskLevel || "LOW").toUpperCase();

    tr.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>Technology</td>
      <td>${emp.age ?? "-"}</td>
      <td>${emp.yearsAtCompany ?? "-"}</td>
      <td><span class="badge ${riskClass}">${riskLabel}</span></td>
      <td>
        <button class="view-btn" data-id="${emp.id}">View</button>
        <button class="predict-btn" data-id="${emp.id}">Predict</button>
      </td>
    `;

    employeesTableBody.appendChild(tr);
  });
}

employeesTableBody.addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.getAttribute("data-id");
  if (!id) return;

  const emp = employees.find((x) => String(x.id) === String(id));
  if (!emp) return;

  if (target.classList.contains("view-btn")) {
    showEmployeeDetails(emp);
  } else if (target.classList.contains("predict-btn")) {
    await predictRiskForEmployee(emp);
  }
});

// ===============================
// EMPLOYEE DETAILS & PREDICT
// ===============================
function showEmployeeDetails(emp) {
  const riskClass = getRiskClass(emp.riskLevel);
  const riskLabel = String(emp.riskLevel || "LOW").toUpperCase();
  const riskPercent = emp.riskScore
    ? Math.round(emp.riskScore * 100)
    : "N/A";

  employeeDetailsPanel.innerHTML = `
    <h3>Employee Details</h3>
    <p class="section-subtitle">Technology · ML-powered risk profile</p>
    <div class="details-block">
      <div class="details-main-title">${emp.name}</div>
      <div class="details-row">
        <span class="details-label">Employee ID</span>
        <span>${emp.id}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Job Role</span>
        <span>Technology</span>
      </div>
      <div class="details-row">
        <span class="details-label">Gender</span>
        <span>${emp.gender}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Age</span>
        <span>${emp.age ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Years @ Company</span>
        <span>${emp.yearsAtCompany ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Monthly Income</span>
        <span>${emp.monthlyIncome ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Company Tenure</span>
        <span>${emp.companyTenure ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Promotions</span>
        <span>${emp.promotions ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Dependents</span>
        <span>${emp.dependents ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Distance from Home</span>
        <span>${emp.distanceFromHome ?? "-"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Attrition Risk</span>
        <span><span class="badge ${riskClass}">${riskLabel}</span> (${riskPercent}%)</span>
      </div>
    </div>
  `;
}

async function predictRiskForEmployee(emp) {
  try {
    showLoading(true);
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "Age": emp.age,
        "Years at Company": emp.yearsAtCompany,
        "Monthly Income": emp.monthlyIncome,
        "Number of Promotions": emp.promotions,
        "Distance from Home": emp.distanceFromHome,
        "Number of Dependents": emp.dependents,
        "Company Tenure": emp.companyTenure,
      }),
    });
    if (!res.ok) throw new Error("Prediction failed");
    const data = await res.json();

    emp.riskScore = data.riskScore;
    emp.riskLevel = data.riskLevel;

    renderEmployeesTable();
    showEmployeeDetails(emp);
    updateCharts();
    renderHeatmap();
    showToast(
      `New prediction for ${emp.name}: ${Math.round(
        data.riskScore * 100
      )}% (${data.riskLevel})`,
      "success"
    );
  } catch (err) {
    console.error(err);
    showToast("Prediction API error.", "error");
  } finally {
    showLoading(false);
  }
}

// ===============================
// REPORTS
// ===============================
function renderReports() {
  // simple summary: all employees are Technology
  const total = employees.length;
  const highRisk = employees.filter(
    (e) => String(e.riskLevel || "LOW").toUpperCase() === "HIGH"
  ).length;

  reportsTableBody.innerHTML = `
    <tr><td>Technology Employees</td><td>${total}</td></tr>
  `;

  highRiskRoleTableBody.innerHTML = `
    <tr><td>Technology (High Risk)</td><td>${highRisk}</td></tr>
  `;
}

// ===============================
// SETTINGS
// ===============================
saveDisplayNameBtn.addEventListener("click", () => {
  const name = displayNameInput.value.trim();
  if (!name) return;
  displayUsername.textContent = name;
  saveMsg.textContent = "Saved!";
  setTimeout(() => {
    saveMsg.textContent = "";
  }, 2000);
});

// Refresh button
refreshBtn.addEventListener("click", async () => {
  await loadEmployeesFromBackend();
});

// ===============================
// INIT
// ===============================
async function initApp() {
  await loadEmployeesFromBackend();
}

// (Optional) Skip login during dev:
// loginPage.classList.add("hidden");
// mainApp.classList.remove("hidden");
// initApp();
