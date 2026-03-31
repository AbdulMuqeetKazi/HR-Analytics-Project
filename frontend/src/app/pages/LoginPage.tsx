import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Brain } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in (use Navigate component to avoid navigate() in render)
  if (!authLoading && user) {
    console.log("[LoginPage] User already logged in — redirecting to /");
    return <Navigate to="/" replace />;
  }

  // 🔐 Email Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      console.log("[LoginPage] Email login success — navigating to /");
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      console.log("[LoginPage] Google login success — navigating to /");
      navigate("/");
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#7B61FF] flex items-center justify-center">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mt-4">HR Analytics AI</h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 py-3 border rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 py-3 border rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-gray-500">OR</div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border rounded-xl"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
