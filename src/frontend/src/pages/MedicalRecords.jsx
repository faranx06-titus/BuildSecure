import { useEffect, useState } from "react";
import { FileText, User } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    async function loadRecords() {
      try {
        const endpoint =
          user.role === "doctor"
            ? "/doctor/records"
            : "/patient/records";

        const response = await api.get(endpoint);

        setRecords(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load medical records"
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, [user.role]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Clinical Information
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Medical Records
          </h1>

          <p className="text-slate-600 mt-2">
            Access is restricted by backend authorization.
          </p>
        </div>

        {loading && (
          <div className="classic-card p-8 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              <span>Loading medical records...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="classic-card p-16 text-center">
            <FileText
              className="mx-auto text-slate-300"
              size={48}
            />

            <h2 className="font-bold text-xl mt-4 text-slate-900">
              No medical records found
            </h2>

            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              There are no medical records currently available for your account.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {records.map((record) => (
            <div
              key={record.id}
              className="classic-card p-6"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <FileText
                  size={20}
                  className="text-slate-400"
                />

                <h2 className="font-bold text-slate-900">
                  Medical Record #{record.id}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.role === "doctor" && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={17} className="text-slate-400" />
                    <span className="text-sm font-medium">
                      Patient #{record.patient_id}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Diagnosis
                    </p>
                    <p className="mt-1 text-slate-900 font-medium">
                      {record.diagnosis || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Clinical Notes
                    </p>
                    <p className="mt-1 text-slate-700 leading-relaxed">
                      {record.notes || "No additional notes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}