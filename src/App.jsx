import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SystemProvider } from './context/SystemContext';
import Navbar from './components/Navbar';

import AppointmentScheduler from './components/Counselor/AppointmentScheduler';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import StudentDashboard from './pages/StudentDashboard';
import Assessment from './pages/Assessment';
import Appointments from './pages/Appointments';
import Resources from './pages/Resources';
import CounselorDashboard from './pages/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reports from './pages/Reports';
import CounselorAppointments from './pages/CounselorAppointments';
import AdminLogs from './pages/AdminLogs'; // <--- NEW: Create this file for Process 3.2

// Layout includes the persistent Navbar for authenticated processes (Process 0.0)
const LayoutWithNavbar = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Outlet />
  </div>
);

function App() {
  return (
    <SystemProvider>
      <Router>
        <Routes>
          {/* EXTERNAL ENTITY ACCESS: Login (Process 0.0) */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />

          {/* INTERNAL SYSTEM PROCESSES: Navbar included */}
          <Route element={<LayoutWithNavbar />}>
            
            {/* --- Student Portal (DFD Branch 1.0) --- */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assessment" element={<Assessment />} />
            <Route path="/student/appointments" element={<Appointments />} />
            <Route path="/student/resources" element={<Resources />} />

            {/* --- Counselor Portal (DFD Branch 2.0) --- */}
            <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
            <Route path="/counselor/reports" element={<Reports />} />
            <Route path="/counselor/analytics" element={<Reports />} />
            <Route path="/counselor/appointments" element={<CounselorAppointments />} />
            <Route path="/counselor/schedule" element={<AppointmentScheduler />} />
            
            {/* --- Admin Portal (DFD Branch 3.0) --- */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<AdminLogs />} /> {/* <--- FIX: Redirect to Login stops here */}
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<Reports />} /> {/* <--- FIX: Shared analytics logic */}
          </Route>
          
          {/* SECURITY FALLBACK: If route is unknown, return to Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SystemProvider>
  );
}

export default App;
