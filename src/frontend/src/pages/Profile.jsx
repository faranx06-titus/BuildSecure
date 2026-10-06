import { useEffect, useState } from "react";
import {
  Mail,
  ShieldCheck,
  UserRound,
  Building2,
} from "lucide-react";

import api from "../api";
import Layout from "../components/Layout";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/users/me");
        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load profile"
        );
      }
    }

    loadProfile();
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-5">
          {error}
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="glass p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl space-y-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Account
          </p>

          <h1 className="text-3xl font-bold text-white">
            My Profile
          </h1>
        </div>

        <div className="glass overflow-hidden">
          <div className="bg-slate-950/50 backdrop-blur-md px-8 py-10 text-white border-b border-white/10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2ee6c5] to-[#8b5cf6] text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <UserRound size={36} />
              </div>

              <div className="leading-tight">
                <h2 className="text-3xl font-bold">
                  {profile.name}
                </h2>

                <p className="text-slate-400 capitalize text-lg">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
              <Mail className="text-[#2ee6c5]" size={20} />

              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </p>

                <p className="font-medium text-white">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
              <ShieldCheck className="text-[#2ee6c5]" size={20} />

              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Access Level
                </p>

                <p className="font-medium text-white capitalize">
                  {profile.role}
                </p>
              </div>
            </div>

            {profile.department && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                <Building2 className="text-[#2ee6c5]" size={20} />

                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Department
                  </p>

                  <p className="font-medium text-white capitalize">
                    {profile.department}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-[#2ee6c5]">
              <ShieldCheck size={18} />

              <span className="text-sm font-medium tracking-wide">
                Account protected by MediDesk authorization
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}