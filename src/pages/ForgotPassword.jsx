/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Shield, KeyRound, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { requireSupabase } from '../lib/supabase';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Reset Pass, 4: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility States
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Strict Password Requirement Rules
  const passwordRules = {
    minLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const triggerShake = async () => {
    await controls.start({ x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const { error: resetError } = await requireSupabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}${window.location.pathname}#/forgot-password`,
      });
      if (!resetError) {
        setStep(2);
      } else {
        setError(resetError.message || 'Could not send the reset email.');
        triggerShake();
      }
    } catch (err) {
      setError(err.message || 'Unable to reach Supabase.');
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsLoading(true);
    setError('');

    setError('Open the reset link in your email. It will return here securely and let you set a new password.');
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (!isPasswordValid) {
      setError('Password does not meet the security criteria.');
      triggerShake();
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({ password: newPassword });
      if (!updateError) {
        setStep(4);
      } else {
        setError(updateError.message || 'Password update failed. Open the reset link from your email first.');
        triggerShake();
      }
    } catch (err) {
      setError(err.message || 'Failed to update credentials.');
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <motion.div animate={controls} className="w-full max-w-md bg-surface/70 dark:bg-surface-elevated rounded-[2.5rem] shadow-2xl border border-border p-8 md:p-10 relative overflow-hidden">
        
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <ArrowLeft size={16} />
          </button>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Password Recovery</span>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle size={14} className="text-rose-500 shrink-0" />
              <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-tighter">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="text-center md:text-left mb-2">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Find Account</h2>
              <p className="text-xs text-muted-foreground mt-1">Enter your registered institutional email to continue identity verification.</p>
            </div>
            <div>
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Institutional Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@grc.edu.ph" className="w-full px-5 py-4 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-sm text-foreground transition-all" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-campus-blue text-primary-foreground font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Request Verification'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center md:text-left mb-2">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Verify Identity</h2>
              <p className="text-xs text-muted-foreground mt-1">Enter the identity verification code sent directly to: <span className="font-bold text-foreground">{email}</span></p>
            </div>
            <div>
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Verification Code</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="••••••" className="w-full text-center tracking-[0.5em] font-mono px-5 py-4 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-lg text-foreground transition-all" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-campus-blue text-primary-foreground font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center md:text-left mb-2">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">New Credentials</h2>
              <p className="text-xs text-muted-foreground mt-1">Create a robust and distinct replacement password to safeguard system access.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-5 pr-12 py-4 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-sm text-foreground transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1 focus:outline-none"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements List */}
              {newPassword.length > 0 && (
                <div className="p-3 bg-muted/30 dark:bg-muted/20 border border-border rounded-xl space-y-1.5">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Password Requirements</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className={`flex items-center gap-1.5 ${passwordRules.minLength ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                      {passwordRules.minLength ? <Check size={12} /> : <X size={12} />} 8+ Characters
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.hasUpper ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                      {passwordRules.hasUpper ? <Check size={12} /> : <X size={12} />} Uppercase (A-Z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.hasLower ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                      {passwordRules.hasLower ? <Check size={12} /> : <X size={12} />} Lowercase (a-z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.hasNumber ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                      {passwordRules.hasNumber ? <Check size={12} /> : <X size={12} />} Number (0-9)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.hasSpecial ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                      {passwordRules.hasSpecial ? <Check size={12} /> : <X size={12} />} Special (@$!%*?&)
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-5 pr-12 py-4 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-sm text-foreground transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !isPasswordValid} 
              className="w-full bg-campus-blue disabled:opacity-50 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Password Updated</h2>
              <p className="text-xs text-muted-foreground mt-2 px-4 leading-relaxed">Your recovery configuration successfully altered database targets. Use your clean password credentials now.</p>
            </div>
            <button onClick={() => navigate('/login')} className="w-full bg-campus-blue text-primary-foreground font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-soft">
              Proceed to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
