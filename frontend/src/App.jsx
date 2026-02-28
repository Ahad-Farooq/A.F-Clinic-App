import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard'; // Naya page import kiya

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard Route (Receptionist ke liye) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />

        {/* Doctor Dashboard Route (Doctor ke liye) */}
        <Route 
          path="/doctor-dashboard" 
          element={isAuthenticated ? <DoctorDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;