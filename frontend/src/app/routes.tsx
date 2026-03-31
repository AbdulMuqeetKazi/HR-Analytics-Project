import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeeProfilesPage } from "./pages/EmployeeProfilesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "employees", element: <EmployeeProfilesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);
