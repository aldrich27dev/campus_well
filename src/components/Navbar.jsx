import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, ClipboardCheck, 
  Calendar, BookOpen, Moon, Sun, LogOut, TrendingUp, Shield, 
  Users, Activity 
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import NotificationCenter from './NotificationCenter';
import Logo from '../assets/mainlogo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode, userRole = 'student' } = useSystem();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  const navItems = [
    { name: 'User Registry', path: '/admin/dashboard', icon: Users, roles: ['admin'] },
    { name: 'System Logs', path: '/admin/logs', icon: Activity, roles: ['admin'] },
    { name: 'Case Manager', path: '/counselor/dashboard', icon: LayoutDashboard, roles: ['counselor'] },
    { name: 'Analytics', path: userRole === 'admin' ? '/admin/analytics' : '/counselor/analytics', icon: TrendingUp, roles: ['counselor', 'admin'] },
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard, roles: ['student'] },
    { name: 'Assessment', path: '/student/assessment', icon: ClipboardCheck, roles: ['student'] },
    { name: 'Resources', path: '/student/resources', icon: BookOpen, roles: ['student'] },
    { name: 'Appointments', path: userRole === 'counselor' ? '/counselor/appointments' : '/student/appointments', icon: Calendar, roles: ['student', 'counselor'] },
  ];

  const handleLogout = () => navigate('/');
  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    // FIX 1: Responsive Height (h-16 on mobile, h-24 on desktop)
    <nav className={`sticky top-0 z-50 transition-all duration-300 h-16 md:h-24 flex items-center ${
      scrolled || isOpen
      ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800' 
      : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
          onClick={() => navigate(userRole === 'admin' ? '/admin/dashboard' : userRole === 'counselor' ? '/counselor/dashboard' : '/student/dashboard')}
        >
          <div className="h-9 w-9 md:h-11 md:w-11 bg-[#0000 ] dark:bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-white-500 dark:text-[#1e3a8a] font-black shadow-lg overflow-hidden">
            {userRole === 'admin' || userRole === 'counselor' ? <Shield size={18} /> : <img src={Logo} alt="Campus Well" className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-tighter text-[#1e3a8a] dark:text-white leading-none">CampusWell</span>
            <span className="text-[8px] md:text-[9px] font-black text-[#92c37c] uppercase tracking-[0.2em]">
              {userRole.toUpperCase()} PORTAL
            </span>
          </div>
        </div>

        {/* Desktop Nav Pills (Remains Hidden on Mobile) */}
        <div className={`hidden lg:flex items-center p-1.5 rounded-[2rem] border transition-all duration-500 ${
          scrolled ? 'bg-slate-100/50 dark:bg-slate-800/50 border-transparent' : 'bg-white/40 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30'
        }`}>
          {filteredNav.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-6 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                location.pathname === item.path 
                ? 'bg-[#1e3a8a] text-white shadow-lg' 
                : 'text-slate-500 dark:text-slate-400 hover:text-[#1e3a8a]'
              }`}
            >
              <item.icon size={14} strokeWidth={3} /> {item.name}
            </button>
          ))}
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1 md:gap-3">
          <NotificationCenter /> 

          <button 
            onClick={toggleDarkMode} 
            className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-yellow-400 shadow-sm"
          >
            {darkMode ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

          {/* Desktop Logout */}
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
          >
            <LogOut size={16} /> Logout
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[#1e3a8a] dark:text-white" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* FIX 2: Mobile Menu Overlay - More standard mobile UX */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 lg:hidden shadow-2xl overflow-hidden z-[49]"
          >
            <div className="p-6 space-y-1">
              {filteredNav.map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => navigate(item.path)} 
                  className={`w-full text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-4 rounded-xl ${
                    location.pathname === item.path 
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#1e3a8a] dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <item.icon size={18} /> {item.name}
                </button>
              ))}
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-4 mx-6" />
              <button 
                onClick={handleLogout} 
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