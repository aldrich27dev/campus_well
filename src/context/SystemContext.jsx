/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

const normalizeNotificationRecord = (input) => ({
  ...input,
  student: input.student || input.actor_name || 'CampusWell Student',
  yearLevel: input.yearLevel || input.actor_year_level || '',
  status: input.status || input.title,
  roles: input.roles || input.audience_roles || [],
  type: input.type || input.event_type || input.category || 'system',
  category: input.category || 'system',
  read: Boolean(input.read ?? input.read_at),
  time: input.time || (input.created_at ? new Date(input.created_at).toLocaleString() : 'Just now'),
});

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

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    const hydrate = async (authUser) => {
      if (!authUser || !active) return;
      const { data: profileRow } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (!active) return;
      const normalized = normalizeProfileRecord({ ...profileRow, email: authUser.email });
      const role = normalized?.role || 'student';
      setUser({ id: authUser.id, email: authUser.email, name: normalized?.fullName || authUser.email, role });
      setProfile({ ...normalized, source: 'supabase' });
      updateRole(role);
      const { data: appointmentRows } = await supabase.from('appointments').select('*, student:profiles!appointments_student_id_fkey(first_name,last_name,year_level)').order('created_at', { ascending: false });
      if (active && appointmentRows) setAppointments(appointmentRows.map((item) => ({ ...item, date: item.appointment_date, time: item.appointment_time, student: [item.student?.first_name, item.student?.last_name].filter(Boolean).join(' ') || 'CampusWell Student', yearLevel: item.student?.year_level, assistantState: item.status?.[0]?.toUpperCase() + item.status?.slice(1) })));
      const { data: notificationRows } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (active && notificationRows) setNotifications(notificationRows.map(normalizeNotificationRecord));

      const notificationChannel = supabase
        .channel(`notifications-for-${authUser.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, ({ new: notification }) => {
          const isRecipient = notification.recipient_id === authUser.id;
          const isAudienceMember = Array.isArray(notification.audience_roles) && notification.audience_roles.includes(role);
          if (!isRecipient && !isAudienceMember) return;
          const normalizedNotification = normalizeNotificationRecord(notification);
          setNotifications((previous) => previous.some((item) => item.id === normalizedNotification.id)
            ? previous
            : [normalizedNotification, ...previous]);
        })
        .subscribe();
      return () => notificationChannel.unsubscribe();
    };
    let stopNotificationChannel;
    supabase.auth.getUser().then(({ data }) => hydrate(data.user).then((cleanup) => { stopNotificationChannel = cleanup; }));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) hydrate(session.user);
    });
    return () => { active = false; listener.subscription.unsubscribe(); stopNotificationChannel?.(); };
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const login = (userData, role) => {
    const normalizedProfile = normalizeProfileRecord(userData?.profile || userData);
    setUser({ ...userData, role });
    updateRole(role);
    setProfile(normalizedProfile ? { ...normalizedProfile, source: 'database' } : null);
  };

  const logout = () => {
    supabase?.auth.signOut();
    setUser(null);
    setProfile(null);
    updateRole('student'); // Default back to student
    localStorage.removeItem('user_role'); // Clear storage
    localStorage.removeItem('campuswell_user');
    localStorage.removeItem('campuswell_profile');
  };

  const addNotification = async (studentOrMeta, status, meta = {}) => {
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
    if (supabase && user?.id) {
      const payload = {
        recipient_id: meta.recipientId || (roles.includes('student') ? user.id : null),
        audience_roles: roles, title: status, message: newNotif.message,
        category: newNotif.category, risk: newNotif.risk || null,
        actor_name: studentName, actor_year_level: yearLevel || null, event_type: newNotif.type,
      };
      const isStaffAudience = roles.some((role) => role === 'counselor' || role === 'admin');
      const result = isStaffAudience && user.role === 'student'
        ? await supabase.rpc('create_staff_notification', {
          p_title: payload.title, p_message: payload.message, p_audience: payload.audience_roles,
          p_category: payload.category, p_risk: payload.risk, p_actor_name: payload.actor_name,
          p_actor_year_level: payload.actor_year_level, p_event_type: payload.event_type,
        })
        : await supabase.from('notifications').insert(payload).select().single();
      const data = result.data;
      if (result.error) {
        setNotifications(prev => prev.filter(item => item.id !== newNotif.id));
        throw result.error;
      }
      if (data) setNotifications(prev => prev.map(item => item.id === newNotif.id ? normalizeNotificationRecord(data) : item));
    }
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

  const updateProfile = async (nextProfile) => {
    const resolved = typeof nextProfile === 'function' ? nextProfile(profile) : nextProfile;
    setProfile(resolved);
    if (supabase && user?.id) await supabase.from('profiles').update({ first_name: resolved.firstName, middle_name: resolved.middleName, last_name: resolved.lastName, year_level: resolved.yearLevel, contact_number: resolved.contactNumber, address: resolved.address }).eq('id', user.id);
  };

  const updatePassword = async (password) => {
    setProfile(prev => ({ ...(prev || {}), password }));
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    }
  };

  const createAppointment = async (appointment) => {
    const draft = { id: Date.now(), status: 'pending', assistantState: 'Pending', ...appointment };
    setAppointments(prev => [draft, ...prev]);
    if (supabase && user?.id) {
      const { data, error } = await supabase.from('appointments').insert({ student_id: user.id, appointment_date: appointment.date, appointment_time: appointment.time, reason: appointment.reason, status: 'pending' }).select().single();
      if (error) { setAppointments(prev => prev.filter(item => item.id !== draft.id)); throw error; }
      setAppointments(prev => prev.map(item => item.id === draft.id ? { ...item, ...data, date: data.appointment_date, time: data.appointment_time } : item));
    }
  };

  const updateAppointment = async (id, updates) => {
    const previousAppointments = appointments;
    setAppointments(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
    if (supabase && typeof id === 'string') {
      const payload = { ...updates };
      if (payload.date) { payload.appointment_date = payload.date; delete payload.date; }
      if (payload.time) { payload.appointment_time = payload.time; delete payload.time; }
      delete payload.assistantState;
      const { error } = await supabase.from('appointments').update(payload).eq('id', id);
      if (error) {
        setAppointments(previousAppointments);
        throw error;
      }
    }
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
