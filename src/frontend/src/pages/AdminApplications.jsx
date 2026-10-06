import { useEffect, useState } from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      const response = await api.get("/admin/applications/pending");
      setApplications(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load applications");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function approve(id) {
    try {
      await api.post(`/admin/applications/${id}/approve`);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.detail || "Approval failed");
    }
  }

  async function reject(id) {
    try {
      await api.post(`/admin/applications/${id}/reject`);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.detail || "Rejection failed");
    }
  }

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <p className="text-sm text-slate-500">Administration</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Professional Applications
          </h1>
          <p className="text-slate-500 mt-2">
            Review and approve staff onboarding requests.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {application.name}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {application.email}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-sm capitalize">
                      {application.profession}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                      {application.department}
                    </span>
                  </div>

                  {application.specialization && (
                    <p className="mt-4 text-sm">
                      <b>Specialization:</b> {application.specialization}
                    </p>
                  )}

                  {application.experience_years != null && (
                    <p className="mt-1 text-sm">
                      <b>Experience:</b> {application.experience_years} years
                    </p>
                  )}

                  {application.reason && (
                    <p className="mt-3 text-slate-600">
                      {application.reason}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 items-start">
                  <button
                    onClick={() => approve(application.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Check size={17} />
                    Approve
                  </button>

                  <button
                    onClick={() => reject(application.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    <X size={17} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="bg-white rounded-xl p-10 text-center">
              <ShieldCheck className="mx-auto text-green-600" size={40} />
              <h2 className="font-semibold text-lg mt-4">
                No pending applications
              </h2>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}