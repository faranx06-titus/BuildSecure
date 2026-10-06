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
    <aside className="w-64 min-h-screen bg-slate-950/50 backdrop-blur-xl border-r border-white/10 text-white flex flex-col z-20">
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">
          Medi<span className="text-[#2ee6c5]">Desk</span>
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
          Secure Platform
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#2ee6c5] text-slate-950 shadow-[0_0_15px_rgba(46,230,197,0.4)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
        >
          <LogOut size={19} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}