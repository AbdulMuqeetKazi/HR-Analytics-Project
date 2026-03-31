import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Brain,
} from "lucide-react";

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Employee Profiles", path: "/employees" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-30 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">HR Analytics</h1>
            <p className="text-xs text-gray-500">AI Powered</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#4F8CFF] to-[#7B61FF] text-white shadow-lg shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <p className="text-xs text-gray-600">Powered by</p>
          <p className="text-sm font-semibold text-gray-900">AMK_Coder</p>
        </div>
      </div>
    </aside>
  );
}
