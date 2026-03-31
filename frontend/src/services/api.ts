import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Global error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED" || !err.response) {
      console.warn("[API] Network error or timeout — backend may be down:", err.message);
    } else {
      console.error("[API] Server error:", err.response?.status, err.response?.data || err.message);
    }
    return Promise.reject(err);
  },
);

export const getEmployees = async () => {
  const res = await API.get("/employees");
  return res.data;
};

export const getStats = async () => {
  const res = await API.get("/stats");
  return res.data;
};

export const predictEmployee = async (data: any) => {
  const res = await API.post("/predict", data);
  return res.data;
};

export default API;
