import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Shield, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { Button } from '../components/UI';
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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    if (!hasSeenModal) setShowRoleModal(true);
  }, []);

  const triggerShake = async () => {
    await controls.start({ x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    let authenticatedUser = null;

    if (role === 'student') {
      authenticatedUser = MOCK_USERS.student.find((u) => u.email === email && u.password === password);
    } else {
      const userRoleData = MOCK_USERS[role];
      if (email === userRoleData.email && password === userRoleData.password) {
        authenticatedUser = userRoleData;
      }
    }

    if (authenticatedUser) {
      login({ email: authenticatedUser.email, name: authenticatedUser.name }, role);
      navigate(`/${role}/dashboard`);
    } else {
      setError(true);
      triggerShake();
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden transition-colors duration-300 relative px-4">
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleModal(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-border text-center"
            >
              <div className="w-14 h-14 bg-campus-blue/10 text-campus-blue dark:text-campus-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tighter italic mb-2">
                Select Your Access
              </h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Before logging in, please ensure you have selected the correct <span className="text-campus-blue dark:text-campus-green font-bold">Portal Role</span>.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRoleModal(false)}
                className="w-full py-3.5 bg-campus-blue text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-soft"
              >
                Continue
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-surface/70 dark:bg-surface-elevated rounded-[3rem] shadow-2xl border border-border relative z-10 overflow-hidden">
        <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-muted/50 dark:bg-muted/20 border-b md:border-b-0 md:border-r border-border">
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            src={Logo}
            alt="Logo"
            className="h-20 w-20 md:h-32 md:w-32 rounded-3xl mb-4 shadow-2xl object-cover"
          />
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">CampusWell</h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-center mt-2 leading-relaxed">
            Student Mental Health & Wellness<br />Management System
          </p>
        </div>

        <motion.div animate={controls} className="flex flex-col justify-center p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <p className="text-center md:text-left text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:ml-1">Select Your Role</p>
              <div className="flex gap-1 p-1 bg-muted/60 dark:bg-muted/30 rounded-2xl border border-border">
                {['student', 'counselor', 'admin'].map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setRole(r); setError(false); }}
                    className={`flex-1 py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      role === r ? 'bg-surface dark:bg-surface-elevated shadow-sm text-campus-blue dark:text-campus-green' : 'text-muted-foreground'
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
                    className="flex items-center gap-2 p-3 bg-rose-50/70 dark:bg-rose-500/10 border border-rose-100/80 dark:border-rose-500/20 rounded-xl"
                  >
                    <AlertCircle size={14} className="text-rose-500" />
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">Invalid {role} Credentials</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@grc.edu.ph"
                  className={`w-full px-5 py-3.5 md:py-4 bg-muted/30 dark:bg-muted/20 border rounded-2xl outline-none text-sm text-foreground transition-all ${
                    error ? 'border-rose-500' : 'border-border focus:border-campus-blue'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 md:py-4 bg-muted/30 dark:bg-muted/20 border rounded-2xl outline-none text-sm text-foreground transition-all ${
                    error ? 'border-rose-500' : 'border-border focus:border-campus-blue'
                  }`}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-campus-blue text-primary-foreground font-black text-[11px] md:text-xs uppercase tracking-[0.2em] py-4 md:py-5 rounded-2xl shadow-soft transition-all"
            >
              Enter Portal
            </motion.button>
          </form>

          <div className="mt-8 text-center md:text-left space-y-3">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest md:ml-1">
              Don't have an account yet?
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-campus-blue dark:text-campus-green uppercase tracking-widest hover:underline transition-all"
              >
                <Mail size={10} /> Create Account / Register
              </button>
              <span className="w-1 h-1 rounded-full bg-border" />
              <a href="https://www.facebook.com/OfficialGRC" className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-campus-blue dark:text-campus-green uppercase tracking-widest hover:underline transition-all">
                <MessageSquare size={10} /> Contact GRC
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/65 backdrop-blur-sm"
              onClick={() => {
                setShowRegisterModal(false);
                setAcceptTerms(false);
              }}
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 18 }}
              className="relative w-full max-w-lg bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-border"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-campus-blue/10 text-campus-blue dark:text-campus-green flex items-center justify-center shrink-0">
                  <Shield size={22} />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                    Data Privacy Notice
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    CampusWell will collect and process your personal information to create your account and support your access to wellness services, in line with the Philippine Data Privacy Act.
                  </p>
                  <div className="mt-4 rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4 text-sm text-foreground leading-relaxed text-center">
                    By continuing, you confirm that you understand and agree to the Terms & Conditions and consent to the use of your information for account creation.
                  </div>

                  <label className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-surface dark:bg-surface-elevated p-4 cursor-pointer text-left">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-campus-blue focus:ring-campus-blue"
                    />
                    <span className="text-sm text-foreground leading-relaxed">
                      I accept the Terms & Conditions and consent to the processing of my personal data.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  disabled={!acceptTerms}
                  onClick={() => navigate('/register')}
                >
                  Continue to Register
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setAcceptTerms(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
