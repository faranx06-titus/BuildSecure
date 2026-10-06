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

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* Left branding */}
        <div className="hidden lg:flex bg-slate-950 text-white p-12 flex-col justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white text-slate-950 flex items-center justify-center">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  MediDesk
                </h1>
                <p className="text-xs text-slate-400">
                  Secure Healthcare Platform
                </p>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-sm text-slate-400">
                SECURITY-FIRST HEALTHCARE
              </p>

              <h2 className="text-5xl font-bold leading-tight mt-3">
                Healthcare
                <br />
                without
                <br />
                compromise.
              </h2>

              <p className="text-slate-400 mt-6 max-w-md leading-relaxed">
                Secure appointments, protected medical records
                and department-aware access control in one platform.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-500">
              Request → Authenticate → Authorize → Audit
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="p-8 sm:p-12">

          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold">
              MediDesk
            </h1>
            <p className="text-sm text-slate-500">
              Secure Healthcare Platform
            </p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Sign in
            </h2>

            <p className="text-slate-500 mt-2">
              Choose your workspace to continue.
            </p>
          </div>

          {/* Login types */}
          <div className="grid grid-cols-3 gap-2 mb-7">
            {loginOptions.map((option) => {
              const Icon = option.icon;
              const active = loginType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLoginType(option.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Icon size={19} />

                  <p className="text-sm font-semibold mt-2">
                    {option.label}
                  </p>

                  <p
                    className={`text-[10px] mt-1 ${
                      active
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-2 border border-slate-300 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 border border-slate-300 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white rounded-xl p-3.5 font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in securely"}
            </button>
          </form>

          {loginType === "patient" && (
            <p className="text-center text-sm text-slate-500 mt-6">
              New patient?{" "}
              <span className="font-medium text-slate-900">
                Registration available
              </span>
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
            <ShieldCheck size={14} />
            Protected by MediDesk authorization
          </div>

        </div>
      </div>
    </div>
  );
}