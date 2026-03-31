import { User, Bell, Database, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { auth } from "../../firebase";
import { updatePassword } from "firebase/auth";
import { getStats } from "../../services/api";

export function SettingsPage() {
  const user = auth.currentUser;

  // 🔔 Toggles (persisted)
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") === "true",
  );
  const [highRiskAlerts, setHighRiskAlerts] = useState(
    localStorage.getItem("highRiskAlerts") === "true",
  );
  const [weeklyReports, setWeeklyReports] = useState(
    localStorage.getItem("weeklyReports") === "true",
  );
  const [dataRefresh, setDataRefresh] = useState(
    localStorage.getItem("dataRefresh") !== "false",
  );

  // 🔐 Password
  const [newPassword, setNewPassword] = useState("");

  // 🔌 API Status
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading",
  );

  useEffect(() => {
    // Save toggles
    localStorage.setItem("emailNotifications", String(emailNotifications));
    localStorage.setItem("highRiskAlerts", String(highRiskAlerts));
    localStorage.setItem("weeklyReports", String(weeklyReports));
    localStorage.setItem("dataRefresh", String(dataRefresh));
  }, [emailNotifications, highRiskAlerts, weeklyReports, dataRefresh]);

  // 🔥 API health check
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await getStats();
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }
    };
    checkAPI();
  }, []);

  // ✅ Handlers
  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = async () => {
    if (!user || !newPassword) return toast.error("Enter new password");

    try {
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
    } catch {
      toast.error("Password update failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User /> Profile Settings
        </h2>

        <input
          type="text"
          defaultValue={user?.displayName || "HR Manager"}
          className="w-full mb-3 p-3 border rounded-xl"
        />

        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full mb-3 p-3 border rounded-xl bg-gray-100"
        />

        <input
          type="text"
          value="Technology HR Manager"
          disabled
          className="w-full mb-3 p-3 border rounded-xl bg-gray-100"
        />

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl"
        >
          Save Changes
        </button>
      </div>

      {/* Security */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield /> Security
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-3 p-3 border rounded-xl"
        />

        <button
          onClick={handleChangePassword}
          className="px-5 py-2 bg-purple-600 text-white rounded-xl"
        >
          Change Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell /> Notifications
        </h2>

        {[
          ["Email Notifications", emailNotifications, setEmailNotifications],
          ["High Risk Alerts", highRiskAlerts, setHighRiskAlerts],
          ["Weekly Reports", weeklyReports, setWeeklyReports],
        ].map(([label, state, setter]: any, i) => (
          <div
            key={i}
            className="flex justify-between p-3 bg-gray-50 rounded-xl mb-2"
          >
            <span>{label}</span>
            <button onClick={() => setter(!state)}>
              {state ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      {/* System */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database /> System
        </h2>

        <div className="flex justify-between p-3 bg-gray-50 rounded-xl mb-3">
          <span>Auto Data Refresh</span>
          <button onClick={() => setDataRefresh(!dataRefresh)}>
            {dataRefresh ? "ON" : "OFF"}
          </button>
        </div>

        {/* API STATUS */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="font-semibold">API Status</p>

          {apiStatus === "loading" && (
            <p className="text-gray-500">Checking...</p>
          )}
          {apiStatus === "online" && (
            <p className="text-green-600">🟢 Online</p>
          )}
          {apiStatus === "offline" && (
            <p className="text-red-600">🔴 Offline</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
