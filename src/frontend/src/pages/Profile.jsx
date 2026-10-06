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
        <div className="bg-red-50 text-red-700 rounded-xl p-5">
          {error}
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="bg-white rounded-xl p-8">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Account
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-950 px-8 py-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center">
                <UserRound size={30} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {profile.name}
                </h2>

                <p className="text-slate-400 capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-slate-500" />

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="text-slate-500" />

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>

                <p className="font-medium capitalize">
                  {profile.role}
                </p>
              </div>
            </div>

            {profile.department && (
              <div className="flex items-center gap-4">
                <Building2 className="text-slate-500" />

                <div>
                  <p className="text-sm text-slate-500">
                    Department
                  </p>

                  <p className="font-medium capitalize">
                    {profile.department}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-5 border-t border-slate-200">
              <div className="flex items-center gap-2 text-green-700">
                <ShieldCheck size={18} />

                <span className="text-sm font-medium">
                  Account protected by MediDesk authorization
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}