import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LayoutDashboard, ClipboardCheck,
  Calendar, BookOpen, Moon, Sun, LogOut, TrendingUp, Shield,
  Users, Activity, UserCircle2, Settings, ChevronDown
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import NotificationCenter from './NotificationCenter';
import Logo from '../assets/mainlogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const { darkMode, toggleDarkMode, userRole = 'student', user, logout } = useSystem();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'User Registry', path: '/admin/dashboard', icon: Users, roles: ['admin'] },
    { name: 'System Logs', path: '/admin/logs', icon: Activity, roles: ['admin'] },
    { name: 'Case Manager', path: '/counselor/dashboard', icon: LayoutDashboard, roles: ['counselor'] },
    { name: 'Reports', path: userRole === 'admin' ? '/admin/reports' : '/counselor/reports', icon: TrendingUp, roles: ['counselor', 'admin'] },
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard, roles: ['student'] },
    { name: 'Assessment', path: '/student/assessment', icon: ClipboardCheck, roles: ['student'] },
    { name: 'Resources', path: '/student/resources', icon: BookOpen, roles: ['student'] },
    { name: 'Appointments', path: userRole === 'counselor' ? '/counselor/appointments' : '/student/appointments', icon: Calendar, roles: ['student', 'counselor'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));
  const displayName = user?.name || 'Account';
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const goHome = () => navigate(userRole === 'admin' ? '/admin/dashboard' : userRole === 'counselor' ? '/counselor/dashboard' : '/student/dashboard');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 h-16 md:h-24 flex items-center ${
      scrolled || isOpen || profileOpen
        ? 'bg-surface/90 dark:bg-surface-elevated/90 backdrop-blur-xl border-b border-border'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={goHome}>
          <div className="h-9 w-9 md:h-11 md:w-11 bg-surface dark:bg-surface-elevated rounded-xl md:rounded-2xl flex items-center justify-center text-campus-blue font-black shadow-surface overflow-hidden border border-border/70">
            {userRole === 'admin' || userRole === 'counselor' ? <Shield size={18} /> : <img src={Logo} alt="Campus Well" className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-tighter text-foreground leading-none">CampusWell</span>
            <span className="text-[8px] md:text-[9px] font-black text-campus-green uppercase tracking-[0.2em]">
              {userRole.toUpperCase()} PORTAL
            </span>
          </div>
        </div>

        <div className={`hidden lg:flex items-center p-1.5 rounded-[2rem] border transition-all duration-500 ${
          scrolled ? 'bg-muted/70 dark:bg-muted/40 border-transparent' : 'bg-surface/50 dark:bg-surface-elevated/30 border-border/50'
        }`}>
          {filteredNav.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-6 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                location.pathname === item.path
                  ? 'bg-campus-blue text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-campus-blue'
              }`}
            >
              <item.icon size={14} strokeWidth={3} /> {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <NotificationCenter />

          <button
            onClick={toggleDarkMode}
            className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-surface dark:bg-surface-elevated border border-border text-muted-foreground dark:text-yellow-400 shadow-surface"
          >
            {darkMode ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(prev => !prev)}
              className="flex items-center gap-2 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-surface dark:bg-surface-elevated border border-border shadow-surface"
            >
              <div className="h-7 w-7 rounded-xl bg-campus-blue text-primary-foreground flex items-center justify-center text-[10px] font-black">
                {initials}
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className="absolute right-0 mt-3 w-[18rem] rounded-[2rem] bg-surface dark:bg-surface-elevated border border-border shadow-2xl overflow-hidden z-[70]"
                >
                  <div className="p-4 border-b border-border bg-muted/30 dark:bg-muted/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-black text-foreground mt-1">{displayName}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-campus-green mt-1">{userRole} account</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold text-foreground hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors"
                    >
                      <Settings size={16} className="text-campus-blue dark:text-campus-green" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold text-rose-600 hover:bg-rose-50/70 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="lg:hidden p-2.5 rounded-xl bg-surface dark:bg-surface-elevated border border-border text-campus-blue dark:text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-surface dark:bg-surface-elevated border-b border-border lg:hidden shadow-2xl overflow-hidden z-[49]"
          >
            <div className="p-6 space-y-1">
              {filteredNav.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-4 rounded-xl ${
                    location.pathname === item.path
                      ? 'bg-muted dark:bg-muted text-campus-blue dark:text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon size={18} /> {item.name}
                </button>
              ))}
              <div className="h-[1px] bg-border my-4 mx-6" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-campus-blue flex items-center gap-4"
              >
                <UserCircle2 size={18} /> Account Settings
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setProfileOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-rose-500 flex items-center gap-4"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
