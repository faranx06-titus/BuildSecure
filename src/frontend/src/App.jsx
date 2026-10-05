import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2">
        Role: {user?.role}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}