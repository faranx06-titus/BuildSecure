import { useEffect, useState } from "react";
import { Mail, UserRound } from "lucide-react";

import api from "../api";
import Layout from "../components/Layout";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await api.get("/doctor/patients");
        setPatients(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load patients"
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Medical Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Patients
          </h1>

          <p className="text-slate-600 mt-2">
            Patients connected to your appointments.
          </p>
        </div>

        {loading && (
          <div className="classic-card p-8 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              <span>Loading patients...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {!loading && !error && patients.length === 0 && (
          <div className="classic-card p-16 text-center">
            <UserRound
              className="mx-auto text-slate-300"
              size={48}
            />

            <h2 className="font-bold text-xl mt-4 text-slate-900">
              No patients found
            </h2>

            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              No patients are currently assigned to your practice.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="classic-card p-6 group hover:ring-2 hover:ring-slate-900 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    {patient.name}
                  </h2>

                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Patient #{patient.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="text-sm truncate">{patient.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}