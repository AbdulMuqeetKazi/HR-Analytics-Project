import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const departmentData = [
  {
    department: "Technology",
    employees: 368,
    highRisk: 34,
    mediumRisk: 89,
    lowRisk: 245,
  },
  {
    department: "Sales",
    employees: 210,
    highRisk: 28,
    mediumRisk: 62,
    lowRisk: 120,
  },
  {
    department: "Marketing",
    employees: 145,
    highRisk: 15,
    mediumRisk: 45,
    lowRisk: 85,
  },
  {
    department: "Finance",
    employees: 98,
    highRisk: 8,
    mediumRisk: 28,
    lowRisk: 62,
  },
];

const monthlyData = [
  { month: "Jan", attrition: 12, newHires: 15 },
  { month: "Feb", attrition: 15, newHires: 12 },
  { month: "Mar", attrition: 11, newHires: 18 },
  { month: "Apr", attrition: 18, newHires: 14 },
  { month: "May", attrition: 14, newHires: 20 },
  { month: "Jun", attrition: 16, newHires: 17 },
];

const reports = [
  {
    id: 1,
    title: "Monthly Attrition Report",
    description: "Comprehensive analysis of employee turnover for June 2026",
    date: "June 30, 2026",
    type: "Monthly",
  },
  {
    id: 2,
    title: "Risk Assessment Summary",
    description: "AI-powered risk predictions for all employees",
    date: "June 28, 2026",
    type: "Weekly",
  },
  {
    id: 3,
    title: "Technology Department Analysis",
    description: "Detailed breakdown of technology team metrics",
    date: "June 25, 2026",
    type: "Department",
  },
  {
    id: 4,
    title: "Quarterly Performance Review",
    description: "Q2 2026 employee performance and retention metrics",
    date: "June 20, 2026",
    type: "Quarterly",
  },
];

export function ReportsPage() {
  const handleDownload = (reportTitle: string) => {
    toast.success(`Downloading ${reportTitle}...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">
            Access detailed analytics and downloadable reports
          </p>
        </div>
        <button
          onClick={() => toast.success("Generating custom report...")}
          className="px-6 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#7B61FF] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Generate Report
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Department Risk Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="highRisk"
                fill="#ef4444"
                name="High Risk"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="mediumRisk"
                fill="#f59e0b"
                name="Medium Risk"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="lowRisk"
                fill="#10b981"
                name="Low Risk"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Attrition vs New Hires
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="attrition"
                fill="#ef4444"
                name="Attrition"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="newHires"
                fill="#10b981"
                name="New Hires"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Reports
        </h2>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {report.type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownload(report.title)}
                className="p-3 hover:bg-blue-50 rounded-xl transition-colors text-blue-600"
              >
                <Download className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Retention Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">92.4%</p>
          <p className="text-sm text-green-600 mt-2">↑ 2.1% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Reports</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">127</p>
          <p className="text-sm text-gray-600 mt-2">Generated this year</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg Time to Fill</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">28 days</p>
          <p className="text-sm text-orange-600 mt-2">↓ 5 days improvement</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
