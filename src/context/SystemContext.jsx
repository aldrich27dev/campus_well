/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('campuswell_dark_mode') === 'true');
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campuswell_profile')) || null;
    } catch {
      return null;
    }
  });
  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campuswell_appointments')) || [];
    } catch {
      return [];
    }
  });

  // 1. Initialize userRole from localStorage to persist after refresh
  // Fallback to 'student' if nothing is found
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'student');

  // Helper to update both state and localStorage
  const updateRole = (role) => {
    setUserRole(role);
    localStorage.setItem('user_role', role);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('campuswell_dark_mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('campuswell_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('campuswell_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const login = (userData, role) => {
    setUser({ ...userData, role });
    updateRole(role);
    if (userData?.profile) {
      setProfile(prev => ({ ...(prev || {}), ...userData.profile }));
    }
  };

  const logout = () => {
    setUser(null);
    updateRole('student'); // Default back to student
    localStorage.removeItem('user_role'); // Clear storage
  };

  const addNotification = (studentOrMeta, status, meta = {}) => {
    const studentName = typeof studentOrMeta === 'string' ? studentOrMeta : studentOrMeta?.name || 'Student';
    const yearLevel = typeof studentOrMeta === 'object' ? studentOrMeta?.yearLevel : meta.yearLevel;
    const roles = Array.isArray(meta.roles) && meta.roles.length > 0 ? meta.roles : ['student', 'counselor', 'admin'];
    const newNotif = {
      id: Date.now(),
      student: studentName,
      status: status,
      message: meta.message || status,
      time: "Just now",
      read: false,
      yearLevel,
      roles,
      category: meta.category || meta.type || 'system',
      risk: meta.risk || (typeof status === 'string' && status.toLowerCase().includes('high') ? 'High' : undefined),
      type: meta.type || 'system'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateProfile = (nextProfile) => {
    setProfile(nextProfile);
  };

  const updatePassword = (password) => {
    setProfile(prev => ({ ...(prev || {}), password }));
  };

  const createAppointment = (appointment) => {
    setAppointments(prev => [
      { id: Date.now(), status: 'pending', assistantState: 'Pending', ...appointment },
      ...prev,
    ]);
  };

  const updateAppointment = (id, updates) => {
    setAppointments(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  return (
    <SystemContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      notifications, 
      addNotification,
      userRole,      
      setUserRole: updateRole, // Uses the helper to ensure persistence
      user,
      profile,
      login,
      logout,
      updateProfile,
      updatePassword,
      appointments,
      createAppointment,
      updateAppointment,
    }}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </div>
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
