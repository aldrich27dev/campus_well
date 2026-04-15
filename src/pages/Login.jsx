import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Shield, Mail, MessageSquare, AlertCircle } from 'lucide-react'; 
import { useSystem } from '../context/SystemContext';
import Logo from '../assets/mainlogo.png';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();
  const controls = useAnimation(); 
  const { login } = useSystem();
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Mock Credentials
  const MOCK_USERS = {
    student: [
      { email: 'admin@co', password: 'admin', name: 'Aldrich' },
      { email: 'aldrich@grc.edu.ph', password: 'password123', name: 'Aldrich' },
      { email: 'jether@grc.edu.ph', password: 'password123', name: 'Jether' },
      { email: 'rechelleann@grc.edu.ph', password: 'password123', name: 'Rechelle Ann' }
    ],
    counselor: { email: 'counselor@grc.edu.ph', password: 'admin123', name: 'Ms. Jane' },
    admin: { email: 'admin@grc.edu.ph', password: 'root', name: 'SuperAdmin' }
  };

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('has_seen_role_modal');
    if (!hasSeenModal) {
      setShowRoleModal(true);
    }
  }, []);

  const triggerShake = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    let authenticatedUser = null;

    // FIX: Handling the different data structures (Array vs Object)
    if (role === 'student') {
      // Find within the array
      authenticatedUser = MOCK_USERS.student.find(
        (u) => u.email === email && u.password === password
      );
    } else {
      // Direct object matching
      const userRoleData = MOCK_USERS[role];
      if (email === userRoleData.email && password === userRoleData.password) {
        authenticatedUser = userRoleData;
      }
    }

    if (authenticatedUser) {
      // Pass the found user object to context
      login({ email: authenticatedUser.email, name: authenticatedUser.name }, role); 
      navigate(`/${role}/dashboard`); 
    } else {
      setError(true);
      triggerShake(); 
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden transition-colors duration-300 relative">
      
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="w-14 h-14 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter italic mb-2">
                Select Your Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Before logging in, please ensure you have selected the correct <span className="text-[#1e3a8a] font-bold">Portal Role</span>.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRoleModal(false)}
                className="w-full py-3.5 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Continue
              </motion.button>
            </motion.div>
          </div>  
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl h-full md:h-auto grid grid-cols-1 md:grid-cols-2 bg-transparent md:bg-white md:dark:bg-slate-900 md:rounded-[3rem] md:shadow-2xl md:border md:border-slate-100 md:dark:border-slate-800 relative z-10 overflow-hidden">
        
        <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-[#1e3a8a]/5 md:bg-transparent border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          <motion.img 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            src={Logo} 
            alt="Logo" 
            className="h-20 w-20 md:h-32 md:w-32 rounded-3xl mb-4 shadow-2xl object-cover" 
          />
          <h1 className="text-3xl md:text-5xl font-black text-[#1e3a8a] dark:text-white tracking-tighter">CampusWell</h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-center mt-2 leading-relaxed">
            Student Mental Health & Wellness<br/>Management System
          </p>
        </div>

        <motion.div 
          animate={controls}
          className="flex flex-col justify-center p-8 md:p-12 overflow-y-auto md:overflow-visible"
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <p className="text-center md:text-left text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:ml-1">Select Your Role</p>
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {['student', 'counselor', 'admin'].map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setRole(r); setError(false); }}
                    className={`flex-1 py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      role === r ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1e3a8a] dark:text-white' : 'text-slate-400'
                    }`}
                  >
                    {r}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl"
                  >
                    <AlertCircle size={14} className="text-rose-500" />
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">Invalid {role} Credentials</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Institutional Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="name@grc.edu.ph" 
                  className={`w-full px-5 py-3.5 md:py-4 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl outline-none text-sm dark:text-white transition-all ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-[#1e3a8a]'}`} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  className={`w-full px-5 py-3.5 md:py-4 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl outline-none text-sm dark:text-white transition-all ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-[#1e3a8a]'}`} 
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1e3a8a] text-white font-black text-[11px] md:text-xs uppercase tracking-[0.2em] py-4 md:py-5 rounded-2xl shadow-xl shadow-[#1e3a8a]/20 transition-all"
            >
              Enter Portal
            </motion.button>
          </form>

          <div className="mt-8 text-center md:text-left space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest md:ml-1">
              Don't have an account yet?
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a href="mailto:admin@grc.edu.ph" className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-widest hover:underline transition-all">
                <Mail size={10} /> Email Admin
              </a>
              <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
              <a href="https://www.facebook.com/OfficialGRC" className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-widest hover:underline transition-all">
                <MessageSquare size={10} /> Contact GRC
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;