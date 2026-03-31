import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

// Auth guarding is handled by ProtectedRoute — no duplicate check needed here
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-0">
      <Sidebar />
      <MobileNav />
      <div className="lg:ml-64">
        <Header />
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
