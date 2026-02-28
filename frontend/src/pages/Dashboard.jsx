import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', age: '', gender: 'Male', contact: '', assignedDoctor: '' 
  });
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Staff', role: 'receptionist' };

  const doctorsList = [
    { id: 1, name: "Dr. Ahmed (Cardiologist)", shift: "09:00 AM - 02:00 PM", room: "Room 101", days: ["MON", "WED", "FRI"] },
    { id: 2, name: "Dr. Omer (General Physician)", shift: "02:00 PM - 08:00 PM", room: "Room 105", days: ["MON", "TUE", "WED", "THU"] },
    { id: 3, name: "Dr. Sara (Pediatrician)", shift: "10:00 AM - 04:00 PM", room: "Room 202", days: ["TUE", "THU", "SAT"] },
    { id: 4, name: "Dr. Zaid (Orthopedic Surgeon)", shift: "04:00 PM - 10:00 PM", room: "Room 108", days: ["FRI", "SAT"] },
    { id: 5, name: "Dr. Hania (Dermatologist)", shift: "11:00 AM - 05:00 PM", room: "Room 301", days: ["MON", "TUE", "THU", "FRI"] },
    { id: 6, name: "Dr. Bilal (ENT Specialist)", shift: "08:00 AM - 01:00 PM", room: "Room 205", days: ["WED", "SAT"] }
  ];

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/all');
      setPatients(res.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients/add', formData);
      alert("✅ Patient Registered Successfully");
      setFormData({ name: '', age: '', gender: 'Male', contact: '', assignedDoctor: '' });
      fetchPatients();
    } catch (err) { alert("Error adding patient"); }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* SIDEBAR */}
      <div className="w-72 bg-[#0F172A] text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-8 pb-10">
          <h1 className="text-3xl font-extrabold italic tracking-tighter flex items-center gap-2">
            A.F <span className="text-blue-500">Clinic</span>
          </h1>
          <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'records', label: 'Patient Records', icon: '📁' },
            { id: 'schedules', label: 'Doctor Roster', icon: '🗓️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all italic">
            Log Out System
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Management Portal</h2>
            <p className="text-xl font-extrabold text-slate-800 uppercase italic tracking-tighter">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'records' ? 'Medical Archives' : 'Shift Schedule'}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold italic">{user.name[0]}</div>
            <div><p className="text-sm font-bold leading-none text-slate-800">{user.name}</p><p className="text-[10px] font-black text-blue-600 uppercase mt-1">{user.role}</p></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' ? (
              /* REGISTRATION DESK VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-extrabold mb-8 flex items-center gap-3"><span className="w-2 h-6 bg-blue-600 rounded-full"></span> Register Patient</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input type="text" placeholder="Patient Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold uppercase italic text-xs" onChange={(e)=>setFormData({...formData, name: e.target.value})} value={formData.name} required />
                      <div className="flex gap-4">
                        <input type="number" placeholder="Age" className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl font-semibold" onChange={(e)=>setFormData({...formData, age: e.target.value})} value={formData.age} required />
                        <select className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, gender: e.target.value})} value={formData.gender}>
                          <option value="Male">Male</option><option value="Female">Female</option>
                        </select>
                      </div>
                      <input type="text" placeholder="Contact" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" onChange={(e)=>setFormData({...formData, contact: e.target.value})} value={formData.contact} required />
                      <select className="w-full p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl font-extrabold text-blue-700" onChange={(e)=>setFormData({...formData, assignedDoctor: e.target.value})} value={formData.assignedDoctor} required>
                        <option value="">Assign Specialist</option>
                        {doctorsList.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}
                      </select>
                      <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl uppercase text-xs tracking-widest mt-4">Confirm Appointment</button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b flex justify-between items-center bg-white"><h3 className="text-lg font-extrabold">Active Queue</h3><span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Live Stream</span></div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                        <tr><th className="p-6">Token</th><th className="p-6">Patient</th><th className="p-6">Specialist</th><th className="p-6 text-right">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {/* Sirf Pending Patients dikhana */}
                        {patients.filter(p => p.status !== 'completed').map((p, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition-all font-medium italic">
                            <td className="p-6 font-black text-blue-600 text-lg">#{index + 101}</td>
                            <td className="p-6"><div className="font-extrabold text-slate-800 uppercase text-xs">{p.name}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{p.age} Yrs • {p.gender}</div></td>
                            <td className="p-6 text-sm font-bold text-slate-600 uppercase">{p.assignedDoctor.split(' (')[0]}</td>
                            <td className="p-6 text-right"><button onClick={() => {setSelectedPatient(p); setIsModalOpen(true);}} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Open Pass</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeTab === 'records' ? (
              /* COMPLETED RECORDS VIEW */
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
                <div className="p-10 bg-slate-900 text-white">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">A.F Medical Archives</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">Historical Treatment Logs</p>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                      <tr><th className="p-6">Date</th><th className="p-6">Patient</th><th className="p-6">Assigned Doctor</th><th className="p-6 text-right">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-sm">
                      {patients.filter(p => p.status === 'completed').length > 0 ? (
                        patients.filter(p => p.status === 'completed').map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-all">
                            <td className="p-6 text-slate-500 font-mono">{new Date(p.date).toLocaleDateString()}</td>
                            <td className="p-6 text-slate-800 uppercase italic font-black">{p.name}</td>
                            <td className="p-6 text-blue-600 uppercase text-xs">{p.assignedDoctor}</td>
                            <td className="p-6 text-right"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Archived</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em]">No Records Found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ROSTER VIEW */
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in duration-500">
                <div className="p-10 bg-slate-900 text-white"><h3 className="text-3xl font-black italic tracking-tighter">Physician Roster</h3><p className="text-slate-400 text-xs font-bold uppercase mt-2">Staff Availability Schedule</p></div>
                <div className="p-6"><table className="w-full text-left font-semibold text-sm">
                    <tbody className="divide-y">
                      {doctorsList.map((doc, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-6 font-black italic">{doc.name}</td>
                          <td className="p-6"><div className="flex gap-1">{doc.days.map((d, idx) => (<span key={idx} className="bg-slate-900 text-white px-2 py-1 rounded-md text-[9px] font-black">{d}</span>))}</div></td>
                          <td className="p-6 text-slate-600">{doc.shift}</td>
                          <td className="p-6 text-right"><span className="text-emerald-500 font-black text-[10px] uppercase">Available</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-6 transition-all">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-10 text-white text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 italic">Official Appointment Pass</p>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">A.F Clinic</h3>
            </div>
            <div className="p-10 space-y-6">
              <div className="bg-slate-50 p-8 rounded-4xl border border-slate-100 space-y-4 shadow-inner font-bold uppercase italic">
                <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400">Name</span><span className="text-slate-800">{selectedPatient.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400">Physician</span><span className="text-blue-600 text-xs">{selectedPatient.assignedDoctor.split(' (')[0]}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center uppercase font-black italic">
                <div className="bg-white p-5 rounded-3xl border-2 shadow-sm"><p className="text-[9px] text-slate-400 mb-1">Day</p><p className="text-slate-700 text-xs">{new Date(selectedPatient.date).toLocaleDateString('en-US', { weekday: 'long' })}</p></div>
                <div className="bg-white p-5 rounded-3xl border-2 shadow-sm"><p className="text-[9px] text-slate-400 mb-1">Slot</p><p className="text-blue-600 text-xs">10:30 AM</p></div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all uppercase text-[10px] tracking-widest mt-4">Dismiss Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;