import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios.instance";
import { useGlobalContext } from "@/contexts/Context";
import { Button } from "@/components/ui/button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/signin", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F3] relative overflow-hidden font-sans">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231C2428' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] px-4 relative z-10"
      >
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(28,36,40,0.15)] overflow-hidden border border-[#E8E3D8]">
          {/* Accent Header Line */}
          <div className="h-1.5 bg-[#1C2428]" />

          <div className="p-10 md:p-12">
            {/* Branding Section */}
            <div className="text-center mb-10">
              <div className="inline-flex mb-5">
                 <img src="/logo_complement.png" alt="Olis Knitwear" className="" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-4 bg-[#D4C5B0]" />
                <p className="text-xs text-[#666666] font-bold tracking-[0.2em] uppercase">
                  Admin Portal
                </p>
                <span className="h-px w-4 bg-[#D4C5B0]" />
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999] group-focus-within:text-[#1C2428] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-[#F5F1E8]/30 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C2428] focus:ring-1 focus:ring-[#1C2428]/2 focus:bg-white transition-all duration-300 placeholder:text-[#BBB]"
                    placeholder="admin@olisknitwear.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mx-1">
                  <label className="block text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Password
                  </label>
                 
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999] group-focus-within:text-[#1C2428] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 text-sm bg-[#F5F1E8]/30 border border-[#E8E3D8] rounded-xl focus:outline-none focus:border-[#1C2428] focus:ring-1 focus:ring-[#1C2428]/2 focus:bg-white transition-all duration-300 placeholder:text-[#BBB]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#999999] hover:text-[#1C2428] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-7 bg-[#1C2428] hover:bg-[#1A1A1A] text-white rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg shadow-[#1C2428]/20 disabled:opacity-80 relative overflow-hidden group"
              >
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4C5B0]" />
                    <span>AUTHENTICATING...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>SECURE LOGIN</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* System Footer */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[11px] text-[#666666] font-medium tracking-wider">
            © {new Date().getFullYear()} OLIS KNITWEAR • ADMIN SYSTEM
          </p>
          <div className="h-1 w-8 bg-[#D4C5B0]/30 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

export default Login;