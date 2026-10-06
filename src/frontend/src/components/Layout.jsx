import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Blobs for the Modern Look */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <Sidebar
        role={user.role}
        department={user.department}
      />

      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}