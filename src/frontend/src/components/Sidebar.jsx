import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  UserCircle,
  Receipt,
  UserCog,
  Shield,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function Sidebar({ role, department }) {
  const links = [];

  if (role === "patient") {
    links.push(
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/appointments", label: "Appointments", icon: CalendarDays },
      { to: "/records", label: "Medical Records", icon: FileText },
      { to: "/profile", label: "Profile", icon: UserCircle },
      {
  to: "/book-appointment",
  label: "Book Appointment",
  icon: CalendarDays,
},
    );
  }

  if (role === "doctor") {
    links.push(
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/appointments", label: "Appointments", icon: CalendarDays },
      { to: "/patients", label: "Patients", icon: Users },
      { to: "/records", label: "Medical Records", icon: FileText },
      { to: "/profile", label: "Profile", icon: UserCircle },
    );
  }

  if (role === "admin") {
  links.push(
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    {
      to: "/admin/applications",
      label: "Applications",
      icon: UserCheck,
    },
    {
      to: "/security",
      label: "Security Center",
      icon: Shield,
    },
  );
}

  if (role === "staff") {
    links.push({
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    });

    if (department === "finance") {
      links.push({
        to: "/billing",
        label: "Billing",
        icon: Receipt,
      });
    }

    if (department === "hr") {
      links.push({
        to: "/staff",
        label: "Staff Management",
        icon: UserCog,
      });
    }

    if (department === "operations") {
      links.push(
        {
          to: "/appointments",
          label: "Appointments",
          icon: CalendarDays,
        },
        {
          to: "/schedule",
          label: "Schedule",
          icon: CalendarDays,
        },
      );
    }

    if (department === "security") {
      links.push({
        to: "/security",
        label: "Security Center",
        icon: Shield,
      });
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">MediDesk</h1>
        <p className="text-xs text-slate-400 mt-1">
          Secure Healthcare Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={19} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}