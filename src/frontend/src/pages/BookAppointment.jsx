import { useEffect, useState } from "react";
import {
  CalendarPlus,
  UserRound,
  Clock,
  FileText,
} from "lucide-react";

import api from "../api";
import Layout from "../components/Layout";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);

  const [doctorId, setDoctorId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await api.get("/users/doctors");
        setDoctors(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load doctors"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setBooking(true);

    try {
      const response = await api.post(
        "/appointments/",
        {
          doctor_id: Number(doctorId),
          appointment_time: new Date(
            appointmentTime
          ).toISOString(),
          reason: reason || null,
        }
      );

      setMessage(
        response.data.message ||
          "Appointment booked successfully"
      );

      setDoctorId("");
      setAppointmentTime("");
      setReason("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to book appointment"
      );
    } finally {
      setBooking(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Patient Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Book Appointment
          </h1>

          <p className="text-slate-500 mt-2">
            Schedule an appointment with an available doctor.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8">
            Loading doctors...
          </div>
        )}

        {!loading && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
          >
            <div className="space-y-6">

              {/* Doctor */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <UserRound size={17} />
                  Select Doctor
                </label>

                <select
                  value={doctorId}
                  onChange={(e) =>
                    setDoctorId(e.target.value)
                  }
                  required
                  className="w-full border border-slate-300 rounded-lg p-3 bg-white"
                >
                  <option value="">
                    Choose a doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name}
                      {doctor.department
                        ? ` — ${doctor.department}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Clock size={17} />
                  Appointment Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={appointmentTime}
                  onChange={(e) =>
                    setAppointmentTime(e.target.value)
                  }
                  required
                  className="w-full border border-slate-300 rounded-lg p-3"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText size={17} />
                  Reason for Visit
                </label>

                <textarea
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  rows={4}
                  maxLength={500}
                  placeholder="Briefly describe the reason for your appointment"
                  className="w-full border border-slate-300 rounded-lg p-3 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={booking}
                className="w-full bg-slate-950 text-white rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
              >
                <CalendarPlus size={18} />

                {booking
                  ? "Booking..."
                  : "Book Appointment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}