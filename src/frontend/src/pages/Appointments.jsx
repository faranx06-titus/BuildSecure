import { useEffect, useState } from "react";
import { CalendarDays, Clock, User } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    async function loadAppointments() {
      try {
        const endpoint =
          user.role === "doctor"
            ? "/doctor/appointments"
            : "/patient/appointments";

        const response = await api.get(endpoint);

        setAppointments(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load appointments"
        );
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
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            MediDesk
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Appointments
          </h1>

          <p className="text-slate-600 mt-2">
            {user.role === "doctor"
              ? "Manage your assigned appointments."
              : "View your scheduled appointments."}
          </p>
        </div>

        {loading && (
          <div className="classic-card p-8 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              <span>Loading appointments...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="classic-card p-16 text-center">
            <CalendarDays
              className="mx-auto text-slate-300"
              size={48}
            />

            <h2 className="font-bold text-xl mt-4 text-slate-900">
              No appointments found
            </h2>

            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              There are currently no scheduled appointments in your calendar.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="classic-card p-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={18}
                      className="text-slate-400"
                    />

                    <span className="font-bold text-slate-900">
                      Appointment #{appointment.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-sm">
                        {new Date(
                          appointment.appointment_time
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="text-sm">
                        {user.role === "doctor"
                          ? `Patient #${appointment.patient_id}`
                          : `Doctor #${appointment.doctor_id}`}
                      </span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-600 italic">
                        "{appointment.reason}"
                      </p>
                    </div>
                  )}
                </div>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider capitalize">
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}