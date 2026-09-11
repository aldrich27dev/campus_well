import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, UserRound, Mail, BadgeInfo, Eye, EyeOff, Check, X, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useSystem } from '../context/SystemContext';
import { supabase } from '../lib/supabase';

const formatValue = (value, fallback = 'Not provided') => {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();
  return text && text !== 'N/A' ? text : fallback;
};

const normalizeProfile = (payload, fallbackUser = {}) => {
  const source = payload?.profile || payload?.user || payload?.data || payload || {};

  const firstName = source.firstName || source.firstname || source.first_name || source.fname || '';
  const middleName = source.middleName || source.middlename || source.middle_name || source.mname || '';
  const lastName = source.lastName || source.lastname || source.last_name || source.lname || '';
  const fullName = source.name || source.fullName || source.fullname || [firstName, middleName, lastName].filter(Boolean).join(' ').trim();

  return {
    studentId: source.studentId || source.student_id || source.idNumber || source.id_number || source.student_no || '',
    firstName,
    middleName,
    lastName,
    fullName,
    yearLevel: source.yearLevel || source.year_level || source.year || '',
    contactNumber: source.contactNumber || source.contact_number || source.phone || source.mobile || '',
    email: source.email || fallbackUser.email || '',
    address: source.address || source.homeAddress || source.home_address || '',
    role: source.role || fallbackUser.role || '',
  };
};

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, updatePassword } = useSystem();
  
  // Password States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Modal & Status States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Validation Rules
  const passwordRules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = isPasswordValid && doPasswordsMatch;

  const resolvedProfile = useMemo(
    () => normalizeProfile(profile || user || {}, user || {}),
    [profile, user]
  );
  const fullProfileName = [
    resolvedProfile.firstName,
    resolvedProfile.middleName && resolvedProfile.middleName !== 'N/A' ? resolvedProfile.middleName : '',
    resolvedProfile.lastName,
  ].filter(Boolean).join(' ').trim();

  useEffect(() => {
    let cancelled = false;
    const fallbackProfile = normalizeProfile(profile || user || {}, user || {});
    const hasFallbackData = Boolean(
      fallbackProfile.studentId ||
      fallbackProfile.firstName ||
      fallbackProfile.middleName ||
      fallbackProfile.lastName ||
      fallbackProfile.yearLevel ||
      fallbackProfile.contactNumber ||
      fallbackProfile.address
    );

    const loadProfile = async () => {
      if (!user?.email) return;

      setLoadingProfile(true);
      setProfileError('');

      try {
        if (!supabase || !user?.id) throw new Error('Supabase is not configured');
        const { data: payload, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error || !payload) throw error || new Error('Profile not found');

        const normalized = normalizeProfile(payload, user);
        if (!cancelled && Object.values(normalized).some(Boolean)) {
          updateProfile({
            ...normalized,
            source: 'supabase',
          });
          setProfileError('');
        }
      } catch {
        if (!cancelled) {
          if (!hasFallbackData) {
            setProfileError('Your Supabase profile could not be loaded.');
          }
        }
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profile, updateProfile, user, user?.email, user?.role]);

  const details = {
    studentId: formatValue(resolvedProfile.studentId),
    lastName: formatValue(resolvedProfile.lastName),
    middleName: formatValue(resolvedProfile.middleName),
    firstName: formatValue(resolvedProfile.firstName),
    yearLevel: formatValue(resolvedProfile.yearLevel),
    contactNumber: formatValue(resolvedProfile.contactNumber),
    email: formatValue(resolvedProfile.email || user?.email),
    address: formatValue(resolvedProfile.address),
    role: formatValue(resolvedProfile.role || user?.role, 'student'),
  };
  const displayName = fullProfileName || resolvedProfile.fullName || user?.name || 'Not provided';

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    await updatePassword(password.trim());
    setPassword('');
    setConfirmPassword('');
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-10 relative">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-campus-blue transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[3rem] bg-surface dark:bg-surface-elevated border border-border p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Settings</p>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground mt-2">
                  Profile Details
                </h1>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-campus-blue/10 text-campus-blue dark:text-campus-green flex items-center justify-center">
                <UserRound size={24} />
              </div>
            </div>

            <div className="mb-6 rounded-[2rem] border border-border bg-gradient-to-br from-campus-blue/10 via-surface to-campus-green/10 p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Logged In User</p>
                  <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tighter text-foreground break-words">
                    {displayName}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground break-all">
                    {details.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 dark:bg-surface-elevated/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <BadgeInfo size={12} className="text-campus-blue dark:text-campus-green" />
                    {details.role}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 dark:bg-surface-elevated/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Mail size={12} className="text-campus-blue dark:text-campus-green" />
                    {loadingProfile ? 'Syncing profile' : profile?.source === 'supabase' ? 'Synced from Supabase' : profile ? 'Profile cached' : 'Login identity only'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Student ID</p>
                <p className="text-sm font-bold text-foreground">{details.studentId}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Role</p>
                <p className="text-sm font-bold text-foreground capitalize">{details.role}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Name</p>
                <p className="text-sm font-bold text-foreground">{displayName}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Year Level</p>
                <p className="text-sm font-bold text-foreground">{details.yearLevel}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Contact Number</p>
                <p className="text-sm font-bold text-foreground">{details.contactNumber}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Email Address</p>
                <p className="text-sm font-bold text-foreground break-all">{details.email}</p>
              </div>
              <div className="md:col-span-2 rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Address</p>
                <p className="text-sm font-bold text-foreground">{details.address}</p>
              </div>
            </div>

            {profileError && (
              <div className="mt-6 rounded-2xl border border-rose-200/80 bg-rose-50/80 dark:bg-rose-500/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">Database Sync</p>
                <p className="text-sm text-foreground leading-relaxed">{profileError}</p>
              </div>
            )}

            {!resolvedProfile.studentId && !loadingProfile && !profileError && (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Note</p>
                <p className="text-sm text-foreground leading-relaxed">
                  Only the login identity is available right now. Once the account profile is synced or saved, the student record fields below will populate automatically.
                </p>
              </div>
            )}
          </Card>

          <Card className="rounded-[3rem] bg-surface dark:bg-surface-elevated border border-border p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-campus-green/10 text-campus-green flex items-center justify-center mb-5">
                <Lock size={22} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                Change Password
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Only the password can be edited here. All other account details are read-only.
              </p>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full pl-5 pr-12 py-3.5 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-sm text-foreground transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                {password.length > 0 && (
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

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-5 pr-12 py-3.5 bg-muted/30 dark:bg-muted/20 border border-border focus:border-campus-blue rounded-2xl outline-none text-sm text-foreground transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !doPasswordsMatch && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">Passwords do not match.</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={!canSubmit}
                  className="w-full py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save Password
                </Button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Security Tip</p>
              <p className="text-sm text-foreground leading-relaxed">
                Use a strong password with at least 8 characters, mixing uppercase, lowercase, numbers, and special symbols.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface dark:bg-surface-elevated border border-border rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight text-foreground">Confirmed</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Your password has been successfully updated and secured.
              </p>
            </div>
            <Button
              onClick={() => setShowConfirmModal(false)}
              className="w-full bg-campus-blue text-primary-foreground font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-soft"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;