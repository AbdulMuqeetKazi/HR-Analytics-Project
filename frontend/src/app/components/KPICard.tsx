import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  format?: "number" | "percent" | "currency" | "decimal";
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient?: string;
}

export function KPICard({
  icon: Icon,
  title,
  value,
  format,
  trend,
  gradient,
}: KPICardProps) {
  // 🔥 FORMAT HANDLER
  const formatValue = () => {
    if (typeof value !== "number") return value;

    switch (format) {
      case "number":
        return value.toLocaleString(); // 74498 → 74,498

      case "percent":
        return `${value}%`;

      case "currency":
        return `$${value.toLocaleString()}`;

      case "decimal":
        return value.toFixed(2);

      default:
        return value;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            gradient || "bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF]"
          }`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {trend && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              trend.isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend.value}
          </div>
        )}
      </div>

      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>

      <p className="text-3xl font-bold text-gray-900">
        {formatValue()}
      </p>
    </motion.div>
  );
}