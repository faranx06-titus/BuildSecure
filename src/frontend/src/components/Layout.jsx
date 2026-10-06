import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        role={user.role}
        department={user.department}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}