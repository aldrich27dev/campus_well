import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Initialize userRole from localStorage to persist after refresh
  // Fallback to 'student' if nothing is found
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'student');

  // 2. SYNC CHECK: Force state to match URL on mount (helps during development)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/student') && userRole !== 'student') {
      updateRole('student');
    } else if (path.includes('/counselor') && userRole !== 'counselor') {
      updateRole('counselor');
    } else if (path.includes('/admin') && userRole !== 'admin') {
      updateRole('admin');
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Helper to update both state and localStorage
  const updateRole = (role) => {
    setUserRole(role);
    localStorage.setItem('user_role', role);
  };

  const login = (userData, role) => {
    setUser(userData);
    updateRole(role);
  };

  const logout = () => {
    setUser(null);
    updateRole('student'); // Default back to student
    localStorage.removeItem('user_role'); // Clear storage
  };

  const addNotification = (studentName, status) => {
    const newNotif = {
      id: Date.now(),
      student: studentName,
      status: status,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
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
      login,
      logout
    }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          {children}
        </div>
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