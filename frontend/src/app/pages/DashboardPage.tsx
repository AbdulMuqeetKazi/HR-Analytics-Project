import { useEffect, useState } from "react";
import {
  Users,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  Briefcase,
  Home,
  Heart,
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { getStats, getEmployees } from "../../services/api";

// Static fallback trend
const attritionTrendData = [
  { month: "Jan", rate: 12 },
  { month: "Feb", rate: 15 },
  { month: "Mar", rate: 11 },
  { month: "Apr", rate: 18 },
  { month: "May", rate: 14 },
  { month: "Jun", rate: 16 },
];

const topRiskFactors = [
  {
    icon: TrendingDown,
    label: "Low Engagement",
    count: 45,
    color: "from-red-500 to-orange-500",
  },
  {
    icon: DollarSign,
    label: "Salary Below Market",
    count: 38,
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Heart,
    label: "Work-Life Balance",
    count: 32,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Briefcase,
    label: "Limited Growth",
    count: 28,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Home,
    label: "Remote Work Issues",
    count: 24,
    color: "from-green-500 to-teal-500",
  },
];

export function DashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📡 Fetching dashboard data...");

        const statsData = await getStats();
        const empData = await getEmployees();

        console.log("✅ Stats:", statsData);
        console.log("✅ Employees:", empData);

        setStats(statsData);
        setEmployees(empData.employees || []);
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Derived data
  const highRiskEmployees = employees
    .filter((e) => e.riskLevel !== "LOW")
    .slice(0, 5)
    .map((e) => ({
      id: e["Employee ID"],
      name: "Employee",
      role: e["Job Role"],
      riskScore: (e.riskScore * 100).toFixed(1),
      riskLevel: e.riskLevel?.toLowerCase(),
    }));

  const riskDistributionData = [
    {
      name: "Low Risk",
      value: stats.lowRiskCount || 0,
      color: "#10b981",
    },
    {
      name: "Medium Risk",
      value: stats.mediumRiskCount || 0,
      color: "#f59e0b",
    },
    {
      name: "High Risk",
      value: stats.highRiskCount || 0,
      color: "#ef4444",
    },
  ];

  // 🔄 Loading
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor employee attrition risk in real-time
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={Users}
          title="Total Employees"
          value={stats.totalEmployees || 0}
          format="number"
        />

        <KPICard
          icon={AlertTriangle}
          title="High Risk Employees"
          value={stats.highRiskCount || 0}
          format="number"
          gradient="bg-gradient-to-br from-red-500 to-orange-500"
        />

        <KPICard
          icon={Clock}
          title="Avg Risk Score"
          value={stats.avgRiskScore || 0}
          format="decimal"
          gradient="bg-gradient-to-br from-green-500 to-teal-500"
        />

        <KPICard
          icon={DollarSign}
          title="High Risk %"
          value={stats.highRiskPercent || 0}
          format="percent"
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Attrition Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attritionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#4F8CFF"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Risk Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
              >
                {riskDistributionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Risk Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            High Risk Employees
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Level</th>
              </tr>
            </thead>

            <tbody>
              {highRiskEmployees.map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="p-3">{e.id}</td>
                  <td className="p-3">{e.role}</td>
                  <td className="p-3">{e.riskScore}%</td>
                  <td className="p-3">{e.riskLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Top Risk Factors
          </h2>

          {topRiskFactors.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${f.color} rounded-lg flex items-center justify-center`}
              >
                <f.icon className="text-white w-5 h-5" />
              </div>

              <div>
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-gray-500">
                  {f.count} employees
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}