import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '../context/SystemContext';

const SessionTimeoutWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useSystem();
  const timeoutRef = useRef(null);
  
  // Set window period length: 20 minutes in milliseconds
  const INACTIVITY_LIMIT = 20 * 60 * 1000; 

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Auto-logout triggers only if an authorized session is active
    if (user) {
      timeoutRef.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_LIMIT);
    }
  };

  const handleAutoLogout = () => {
    logout();
    localStorage.removeItem('user_session'); 
    navigate('/login', { replace: true });
    // Soft reload to purge remaining context states safely
    window.location.reload(); 
  };

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Bind listeners across the global viewport environment
    events.forEach(event => window.addEventListener(event, resetTimeout));
    resetTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [user]);

  return <>{children}</>;
};

export default SessionTimeoutWrapper;