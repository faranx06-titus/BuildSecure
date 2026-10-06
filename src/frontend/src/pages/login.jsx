import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  Stethoscope,
  Building2,
} from "lucide-react";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const loginOptions = [
    {
      id: "patient",
      label: "Patient",
      icon: UserRound,
      description: "Appointments & records",
    },
    {
      id: "doctor",
      label: "Doctor",
      icon: Stethoscope,
      description: "Clinical workspace",
    },
    {
      id: "staff",
      label: "Staff / Admin",
      icon: Building2,
      description: "Operations & security",
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
          role: "patient",
        });
        alert(response.data.message || "Registration successful!");
        setIsRegistering(false);
      } else {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        const data = response.data;

        if (
          loginType === "patient" &&
          data.role !== "patient"
        ) {
          throw new Error("Please use the correct login portal.");
        }

        if (
          loginType === "doctor" &&
          data.role !== "doctor"
        ) {
          throw new Error("Please use the correct login portal.");
        }

        if (
          loginType === "staff" &&
          !["staff", "admin"].includes(data.role)
        ) {
          throw new Error("Please use the correct login portal.");
        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Action failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 glass overflow-hidden shadow-2xl z-10">
        <div className="hidden lg:flex bg-slate-950/50 backdrop-blur-md text-white p-12 flex-col justify-between border-r border-white/10">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2ee6c5] to-[#8b5cf6] text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck size={25} />
              </div>

              <div className="leading-none">
                <h1 className="text-2xl font-bold tracking-tight">
                  Medi<span className="text-[#2ee6c5]">Desk</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                  Secure Healthcare Platform
                </p>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-sm text-[#2ee6c5] font-medium uppercase tracking-widest">
                SECURITY-FIRST HEALTHCARE
              </p>

              <h2 className="text-5xl font-bold leading-tight mt-3 text-white">
                Healthcare
                <br />
                without
                <br />
                <span className="grad-text">compromise.</span>
              </h2>

              <p className="text-slate-400 mt-6 max-w-md leading-relaxed text-lg">
                Secure appointments, protected medical records
                and department-aware access control in one platform.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs text-slate-500 font-mono">
              Request → Authenticate → Authorize → Audit
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 bg-white/5 backdrop-blur-sm">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-white">
              Medi<span className="text-[#2ee6c5]">Desk</span>
            </h1>
          </div>

          <div className="mb-8">
            <p className="text-sm text-slate-400">
              {isRegistering ? "Join our secure network" : "Welcome back"}
            </p>

            <h2 className="text-3xl font-bold text-white mt-1">
              {isRegistering ? "Create Account" : "Sign in"}
            </h2>

            <p className="text-slate-400 mt-2">
              {isRegistering
                ? "Start managing your health securely."
                : "Choose your workspace to continue."}
            </p>
          </div>

          {!isRegistering && (
            <div className="grid grid-cols-3 gap-2 mb-7">
              {loginOptions.map((option) => {
                const Icon = option.icon;
                const active = loginType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLoginType(option.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      active
                        ? "border-[#2ee6c5] bg-[#2ee6c5]/10 text-white shadow-[0_0_10px_rgba(46,230,197,0.2)]"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                    }`}
                  >
                    <Icon size={19} className={active ? "text-[#2ee6c5]" : ""} />
                    <p className="text-sm font-semibold mt-2">{option.label}</p>
                    <p className={`text-[10px] mt-1 ${active ? "text-slate-300" : "text-slate-500"}`}>
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-[#2ee6c5] transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-[#2ee6c5] transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:ring-2 focus:ring-[#2ee6c5] transition-all"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon rounded-xl p-3.5 font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign in securely"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-400">
              {isRegistering ? "Already have an account?" : "New patient?"}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 font-bold text-[#2ee6c5] hover:underline"
              >
                {isRegistering ? "Sign in instead" : "Create an account"}
              </button>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-[#2ee6c5]" />
            Protected by MediDesk authorization
          </div>
        </div>
      </div>
    </div>
  );
}