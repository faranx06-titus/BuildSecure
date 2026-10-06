import { useEffect, useState } from "react";
import { FileText, User, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function loadRecords() {
      try {
        const endpoint = user.role === "doctor" ? "/doctor/records" : "/patient/records";
        const response = await api.get(endpoint);
        setRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load medical records");
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
          <p className="text-sm font-medium text-[#2ee6c5] uppercase tracking-widest">
            Clinical Intelligence
          </p>
          <h1 className="text-4xl font-bold text-white mt-1">Medical Records</h1>
          <p className="text-slate-400 mt-2 text-lg">
            Securely archived clinical data and diagnostic reports.
          </p>
        </div>

        {loading && (
          <div className="glass p-12 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-[#2ee6c5] rounded-full animate-spin" />
              <span className="font-medium">Decrypting records...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="glass border-red-500/30 bg-red-500/10 text-red-400 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="text-red-400 shrink-0" size={24} />
            <div>
              <p className="font-bold">Authorization Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="glass p-20 text-center space-y-4">
            <FileText className="mx-auto text-slate-600" size={64} />
            <h2 className="text-2xl font-bold text-white">No Records Found</h2>
            <p className="text-slate-400 max-w-xs mx-auto">
              There are no clinical records currently associated with this account.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {records.map((record) => (
            <div key={record.id} className="glass group hover:bg-white/10 transition-all duration-300 p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="text-[#2ee6c5]" size={20} />
              </div>

              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-[#2ee6c5]/10 text-[#2ee6c5]">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Medical Archive #{record.id}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {user.role === "doctor" && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-white/5 text-slate-300">
                    <User size={18} className="text-[#2ee6c5]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Patient Reference</span>
                      <span className="text-sm font-medium">Patient #{record.patient_id}</span>
                    </div>
                  </div>
                )}

                <div className="lg:col-span-2 space-y-6">
                  <div className="relative">
                    <p className="text-xs font-bold text-[#2ee6c5] uppercase tracking-widest mb-2">
                      Primary Diagnosis
                    </p>
                    <p className="text-xl text-white font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                      {record.diagnosis || "Not specified"}
                    </p>
                  </div>

                  <div className="relative">
                    <p className="text-xs font-bold text-[#2ee6c5] uppercase tracking-widest mb-2">
                      Clinical Notes & Observations
                    </p>
                    <p className="text-slate-400 leading-relaxed p-4 rounded-xl bg-slate-950/40 border border-white/5 italic">
                      {record.notes || "No additional clinical notes available."}
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
