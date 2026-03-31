import { Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, reports..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center">
          <span className="text-white font-bold text-sm">HR</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
            <p className="text-xs text-gray-500">Technology HR Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center text-white font-medium">
            SJ
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
        </button>
      </div>
    </header>
  );
}
