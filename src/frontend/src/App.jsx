
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Layout from "./components/Layout";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import AdminApplications from "./pages/AdminApplications";
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;
  const department = user.department;

  let title = "Dashboard";
  let description = "Welcome to MediDesk.";

  if (role === "patient") {
    title = "Patient Workspace";
    description = "Manage your appointments and medical records.";
  }

  if (role === "doctor") {
    title = "Medical Workspace";
    description = "Manage appointments, patients and clinical records.";
  }

  if (role === "staff") {
    if (department === "finance") {
      title = "Finance Workspace";
      description = "Manage billing and financial operations.";
    }

    if (department === "hr") {
      title = "HR Workspace";
      description = "Manage hospital staff operations.";
    }

    if (department === "operations") {
      title = "Operations Workspace";
      description = "Manage appointments and hospital scheduling.";
    }

    if (department === "security") {
      title = "Security Workspace";
      description = "Monitor security events and audit activity.";
    }
  }

  if (role === "admin") {
    title = "Administration";
    description = "Manage MediDesk security and operations.";
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Welcome back
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            {user.name}
          </h1>

          <p className="text-slate-600 mt-2 text-lg">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="classic-card p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Workspace
            </p>

            <p className="text-xl font-bold mt-2 capitalize text-slate-900">
              {department || role}
            </p>
          </div>

          <div className="classic-card p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Access Level
            </p>

            <p className="text-xl font-bold mt-2 capitalize text-slate-900">
              {role}
            </p>
          </div>

          <div className="classic-card p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Security Status
            </p>

            <p className="text-xl font-bold mt-2 text-green-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              Protected
            </p>
          </div>
        </div>

        <div className="classic-card p-8">
          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="text-slate-600 mt-3 leading-relaxed">
            Use the navigation panel to access your authorized
            MediDesk services. All activity is encrypted and audited for security.
          </p>
        </div>
      </div>
    </Layout>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Real Appointments Page */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* Real Medical Records Page */}
        <Route
          path="/records"
          element={
            <ProtectedRoute>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

        {/* Remaining modules */}
         
        <Route
  path="/patients"
  element={
    <ProtectedRoute>
      <Patients />
    </ProtectedRoute>
  }
/>

        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Layout>
                <h1 className="text-3xl font-bold">
                  Billing
                </h1>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Layout>
                <h1 className="text-3xl font-bold">
                  Staff Management
                </h1>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Layout>
                <h1 className="text-3xl font-bold">
                  Schedule
                </h1>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <Layout>
                <h1 className="text-3xl font-bold">
                  Security Center
                </h1>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/book-appointment"
  element={
    <ProtectedRoute>
      <BookAppointment />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/applications"
  element={
    <ProtectedRoute>
      <AdminApplications />
    </ProtectedRoute>
  }
/>

        {/* Unknown route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

