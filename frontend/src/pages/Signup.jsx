import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist' 
  });

  const navigate = useNavigate();

  // List matching the Receptionist Dashboard precisely
  const doctorsList = [
    "Dr. Ahmed (Cardiologist)",
    "Dr. Omer (General Physician)",
    "Dr. Sara (Pediatrician)",
    "Dr. Zaid (Orthopedic Surgeon)",
    "Dr. Hania (Dermatologist)",
    "Dr. Bilal (ENT Specialist)"
  ];

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.1)] w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-blue-600 tracking-tighter italic">A.F Clinic</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Staff Registration Portal</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* ROLE SELECTION FIRST */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Select Designation</label>
            <select 
              className="w-full p-4 bg-blue-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-bold appearance-none transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value, name: ''})}
            >
              <option value="receptionist">Receptionist Staff</option>
              <option value="doctor">Medical Specialist</option>
            </select>
          </div>

          {/* DYNAMIC NAME INPUT */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">
              {formData.role === 'doctor' ? 'Select Doctor Identity' : 'Full Name'}
            </label>
            
            {formData.role === 'doctor' ? (
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-all shadow-inner"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              >
                <option value="">-- Choose Your Identity --</option>
                {doctorsList.map((doc, index) => (
                  <option key={index} value={doc}>{doc}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                placeholder="e.g. Murtaza Najad" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner font-semibold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Work Email</label>
            <input 
              type="email" placeholder="staff@afclinic.com" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner font-semibold"
              onChange={(e) => setFormData({...formData, email: e.target.value})} required 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Secure Password</label>
            <input 
              type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner font-semibold"
              onChange={(e) => setFormData({...formData, password: e.target.value})} required 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95 uppercase tracking-widest text-xs mt-4 italic">
            Authorize Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Registered staff? <Link to="/" className="text-blue-600 font-black hover:underline">Log in to Secure Portal</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;