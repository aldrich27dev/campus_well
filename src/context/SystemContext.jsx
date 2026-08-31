/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemContext = createContext(null);

const normalizeProfileRecord = (input) => {
  if (!input || typeof input !== 'object') return null;

  const firstName = input.firstName || input.firstname || input.first_name || input.fname || '';
  const middleName = input.middleName || input.middlename || input.middle_name || input.mname || '';
  const lastName = input.lastName || input.lastname || input.last_name || input.lname || '';
  const fullName = input.name || input.fullName || input.fullname || [firstName, middleName, lastName].filter(Boolean).join(' ').trim();

  return {
    ...input,
    studentId: input.studentId || input.student_id || input.idNumber || input.id_number || input.student_no || '',
    firstName,
    middleName,
    lastName,
    fullName,
    yearLevel: input.yearLevel || input.year_level || input.year || '',
    contactNumber: input.contactNumber || input.contact_number || input.phone || input.mobile || '',
    email: input.email || '',
    address: input.address || input.homeAddress || input.home_address || '',
    role: input.role || 'student',
  };
};

export const SystemProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('campuswell_dark_mode') === 'true');
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campuswell_user')) || null;
    } catch {
      return null;
    }
  });
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('campuswell_user', JSON.stringify(user));
    }
  }, [user]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const login = (userData, role) => {
    const normalizedProfile = normalizeProfileRecord(userData?.profile || userData);
    setUser({ ...userData, role });
    updateRole(role);
    setProfile(normalizedProfile ? { ...normalizedProfile, source: 'database' } : null);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    updateRole('student'); // Default back to student
    localStorage.removeItem('user_role'); // Clear storage
    localStorage.removeItem('campuswell_user');
    localStorage.removeItem('campuswell_profile');
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

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item)));
  };

  const clearNotifications = (role = 'all') => {
    setNotifications(prev => {
      if (role === 'all') return [];
      return prev.filter((item) => {
        const audience = Array.isArray(item.roles) && item.roles.length > 0 ? item.roles : ['student', 'counselor', 'admin'];
        return !audience.includes(role);
      });
    });
  };

  const updateProfile = (nextProfile) => {
    setProfile(prev => (typeof nextProfile === 'function' ? nextProfile(prev) : nextProfile));
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
      markNotificationRead,
      clearNotifications,
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
