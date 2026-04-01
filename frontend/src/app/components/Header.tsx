import { Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Derive display name from Firebase user
  const displayName = user?.displayName || user?.email?.split("@")[0] || "HR Manager";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">HR Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center text-white font-medium">
            {initials}
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
