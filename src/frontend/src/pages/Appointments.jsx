import { useEffect, useState } from "react";
import { CalendarDays, Clock, User, AlertCircle } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const endpoint = user.role === "doctor" ? "/doctor/appointments" : "/patient/appointments";
        const response = await api.get(endpoint);
        setAppointments(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load appointments");
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, [user.role]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#2ee6c5] uppercase tracking-widest">
            MediDesk Scheduling
          </p>
          <h1 className="text-4xl font-bold text-white mt-1">Appointments</h1>
          <p className="text-slate-400 mt-2 text-lg">
            {user.role === "doctor"
              ? "Clinical calendar and assigned patient sessions."
              : "Your scheduled medical consultations."}
          </p>
        </div>

        {loading && (
          <div className="glass p-12 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-[#2ee6c5] rounded-full animate-spin" />
              <span className="font-medium">Syncing calendar...</span>
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

        {!loading && !error && appointments.length === 0 && (
          <div className="glass p-20 text-center space-y-4">
            <CalendarDays className="mx-auto text-slate-600" size={64} />
            <h2 className="text-2xl font-bold text-white">No Appointments Found</h2>
            <p className="text-slate-400 max-w-xs mx-auto">
              Your schedule is currently clear. New appointments will appear here once confirmed.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="glass group hover:bg-white/10 transition-all duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2ee6c5]/10 text-[#2ee6c5]">
                      <CalendarDays size={18} />
                    </div>
                    <span className="font-mono text-sm text-slate-400">
                      REF: #{appointment.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#2ee6c5]" />
                      <span className="text-sm font-medium">
                        {new Date(appointment.appointment_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#2ee6c5]" />
                      <span className="text-sm font-medium">
                        {user.role === "doctor"
                          ? `Patient #${appointment.patient_id}`
                          : `Doctor #${appointment.doctor_id}`}
                      </span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-white/5 text-slate-400 italic text-sm">
                      "{appointment.reason}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    appointment.status === 'confirmed' 
                      ? 'bg-[#2ee6c5]/20 text-[#2ee6c5] border border-[#2ee6c5]/30' 
                      : 'bg-slate-700/50 text-slate-300 border border-white/10'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
