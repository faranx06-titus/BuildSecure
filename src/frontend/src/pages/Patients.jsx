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
      <div>
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Medical Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Patients
          </h1>

          <p className="text-slate-500 mt-2">
            Patients connected to your appointments.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8">
            Loading patients...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {!loading && !error && patients.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center">
            <UserRound
              className="mx-auto text-slate-400"
              size={42}
            />

            <h2 className="text-lg font-semibold mt-4">
              No patients
            </h2>

            <p className="text-slate-500 mt-2">
              No patients are currently assigned to you.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">
                    {patient.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Patient #{patient.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 text-slate-600">
                <Mail size={17} />
                {patient.email}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}