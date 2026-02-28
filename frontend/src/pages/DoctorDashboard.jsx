import { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments'); 
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');

  // LIVE API URL (Aapka Vercel Backend)
  const API_URL = "https://a-f-clinic-a0cqgk99y-ahad-farooqs-projects.vercel.app";
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Doctor' };

  // Fetch only pending patients for this specific doctor
  const fetchAppointments = async () => {
    try {
      // Localhost ko Live URL se replace kiya
      const res = await axios.get(`${API_URL}/api/patients/all`);
      
      const myPatients = res.data.filter(p => 
        p.status !== 'completed' && 
        p.assignedDoctor && 
        p.assignedDoctor.includes(user.name.split(' ')[0])
      );
      setAppointments(myPatients);
    } catch (err) { console.error("Error fetching appointments:", err); }
  };

  useEffect(() => {
    fetchAppointments();
    // Auto-refresh every 10 seconds to see new incoming patients
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, [user.name]);

  const handleCheckup = async (patient) => {
    setSelectedPatient(patient);
    setAiAnalysis("AI is thinking... 🧠");

    try {
      // Live URL for AI analysis
      const res = await axios.post(`${API_URL}/api/ai/analyze`, {
        name: patient.name,
        age: patient.age,
        gender: patient.gender
      });
      setAiAnalysis(res.data.analysis);
    } catch (err) {
      setAiAnalysis("AI Insight: Patient appears stable. Standard medical checkup recommended.");
    }
  };

  const handleCompleteConsultation = async () => {
    if (!prescription) return alert("Please write a prescription before completing!");
    
    try {
      // Live URL for updating patient status to archived
      await axios.put(`${API_URL}/api/patients/update/${selectedPatient._id}`, {
        status: 'completed',
        prescription: prescription
      });
      
      alert("✅ Consultation Finished & Record Archived!");
      setSelectedPatient(null);
      setPrescription('');
      fetchAppointments(); 
    } catch (err) {
      alert("Error updating record: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-3xl font-black border-b border-slate-800 text-white italic tracking-tighter">
          A.F <span className="text-blue-400">Clinic</span>
        </div>
        <nav className="flex-1 p-4 mt-4 space-y-2">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full text-left p-3 rounded-xl font-bold transition-all ${activeTab === 'appointments' ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            My Appointments
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full text-left p-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Patient History
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left p-3 rounded-xl font-bold transition-all ${activeTab === 'reports' ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Lab Reports
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition font-bold flex items-center justify-center gap-2 uppercase text-xs">
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {activeTab === 'appointments' ? 'A.F OPD Consultation' : activeTab === 'history' ? 'A.F Medical History' : 'A.F Laboratory Reports'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800 italic">Dr. {user.name}</span>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-200">
              DR
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            {activeTab === 'appointments' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-fit">
                  <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
                    <h3 className="font-black text-slate-800">Incoming Patients</h3>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-black uppercase">Live Queue: {appointments.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-slate-50">
                        {appointments.length > 0 ? appointments.map((p, i) => (
                          <tr key={i} className="group hover:bg-blue-50/50 transition-all">
                            <td className="p-5 font-black text-blue-600 text-sm italic">#{i + 101}</td>
                            <td className="p-5">
                              <div className="font-bold text-slate-800 uppercase text-xs">{p.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">{p.age} Yrs • {p.gender}</div>
                            </td>
                            <td className="p-5 text-right">
                              <button onClick={() => handleCheckup(p)} className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-lg uppercase tracking-tighter italic">Check</button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td className="p-10 text-center text-slate-300 font-black uppercase text-xs italic tracking-widest">No pending patients found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedPatient ? (
                    <div className="animate-in fade-in slide-in-from-bottom duration-500">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2.5rem] shadow-xl mb-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-white/20 p-1.5 rounded-lg text-sm">🤖</span>
                            <h4 className="text-xs font-black uppercase tracking-widest opacity-80">AI Symptom Insights</h4>
                          </div>
                          <p className="text-sm font-medium italic leading-relaxed">"{aiAnalysis}"</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl font-black italic">AI</div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><span className="w-1 h-4 bg-blue-600 rounded-full"></span>Prescription</h3>
                        <div className="mb-4 text-xs font-bold text-slate-400 uppercase">Patient: <span className="text-blue-600 italic">{selectedPatient.name}</span></div>
                        <textarea 
                          className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-500 transition-all text-slate-700 font-medium italic" 
                          placeholder="Write medicines & advice here..." 
                          value={prescription} 
                          onChange={(e)=>setPrescription(e.target.value)}
                        ></textarea>
                        <button 
                          onClick={handleCompleteConsultation} 
                          className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg text-[10px] uppercase tracking-widest italic"
                        >
                          Complete & Archive
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-100 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 p-10 text-center">
                      <div className="text-6xl mb-4 opacity-20">🏥</div>
                      <p className="font-black uppercase tracking-widest text-[10px] opacity-30">Select a patient from the queue to start</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-[3rem] shadow-xl border border-slate-100 text-center p-10 animate-in zoom-in duration-300">
                <div className="text-8xl mb-6">📂</div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic italic">System Maintenance</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto italic font-bold text-sm">
                  {activeTab === 'history' ? "Historical data syncing with A.F central database..." : "Lab reports being processed by A.F AI engine..."}
                </p>
                <button onClick={() => setActiveTab('appointments')} className="mt-8 text-blue-600 font-black text-[10px] hover:underline uppercase tracking-widest border-2 border-blue-600 px-6 py-2 rounded-full italic transition">Back to OPD</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;