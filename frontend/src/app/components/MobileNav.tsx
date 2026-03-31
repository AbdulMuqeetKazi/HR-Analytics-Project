import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

export function MobileNav() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Employees", path: "/employees" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                isActive ? "text-[#4F8CFF]" : "text-gray-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 ${isActive ? "fill-blue-100" : ""}`}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
