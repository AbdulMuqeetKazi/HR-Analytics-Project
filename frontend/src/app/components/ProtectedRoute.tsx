import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log("[ProtectedRoute] user:", user ? `uid=${user.uid}` : "null", "| loading:", loading);

  // ⏳ Wait for Firebase to resolve auth state before deciding
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ Not logged in → go to login
  if (!user) {
    console.log("[ProtectedRoute] Not authenticated — redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → render children
  return <>{children}</>;
}
