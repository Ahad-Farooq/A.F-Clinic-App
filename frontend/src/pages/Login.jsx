import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Jab bhi koi is page par aaye, purana session clear ho jaye
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Token aur User Info save karna
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert('Login Successful!');

      // ROLE BASED REDIRECT LOGIC
      if (res.data.user.role === 'doctor') {
        window.location.href = '/doctor-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
      
    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.1)] w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-blue-600 tracking-tighter italic">A.F Clinic</h1>
          <div className="w-10 h-1 bg-blue-600 mx-auto mt-3 rounded-full opacity-20"></div>
          <p className="text-slate-400 mt-4 font-bold uppercase text-[10px] tracking-[0.2em]">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@clinic.com"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95 uppercase tracking-widest text-xs mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="mt-10 text-center text-slate-500 text-sm font-medium">
          New Staff Member? <Link to="/signup" className="text-blue-600 font-black hover:underline">Register Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;