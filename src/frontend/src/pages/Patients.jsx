import { useEffect, useState } from "react";
import { Mail, UserRound, Search, ShieldCheck } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await api.get("/doctor/patients");
        setPatients(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load patients");
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-[#2ee6c5] uppercase tracking-widest">
              Medical Workspace
            </p>
            <h1 className="text-4xl font-bold text-white mt-1">Patient Registry</h1>
            <p className="text-slate-400 mt-2 text-lg">
              Clinical directory of patients assigned to your practice.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#2ee6c5] transition-all backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="glass p-12 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-[#2ee6c5] rounded-full animate-spin" />
              <span className="font-medium">Fetching registry...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="glass border-red-500/30 bg-red-500/10 text-red-400 p-6 rounded-2xl flex items-start gap-4">
            <ShieldCheck className="text-red-400 shrink-0" size={24} />
            <div>
              <p className="font-bold">Authorization Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filteredPatients.length === 0 && (
          <div className="glass p-20 text-center space-y-4">
            <UserRound className="mx-auto text-slate-600" size={64} />
            <h2 className="text-2xl font-bold text-white">No Patients Found</h2>
            <p className="text-slate-400 max-w-xs mx-auto">
              No matching records were found in the secure registry.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="glass group hover:bg-white/10 transition-all duration-300 p-6 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="text-[#2ee6c5]" size={20} />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-[#2ee6c5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserRound size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-white text-xl group-hover:text-[#2ee6c5] transition-colors">
                    {patient.name}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    ID: {patient.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5 text-slate-400 transition-all group-hover:border-[#2ee6c5]/30 group-hover:bg-[#2ee6c5]/5">
                <Mail size={16} className="text-[#2ee6c5]" />
                <span className="text-sm truncate font-medium">{patient.email}</span>
              </div >
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
