import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, UserRound, Mail, BadgeInfo } from 'lucide-react';
import { Card, Button, Input } from '../components/UI';
import { useSystem } from '../context/SystemContext';

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
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
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
        const response = await fetch(`http://localhost:8080/campuswell-api/profile.php?email=${encodeURIComponent(user.email)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const status = String(payload?.status || '').toLowerCase();
        const hasProfile = Boolean(payload?.profile || payload?.user || payload?.data || payload?.email || payload?.student_id || payload?.studentId);

        if ((status && status !== 'success') || !hasProfile) {
          throw new Error(payload?.message || 'Profile not found');
        }

        const normalized = normalizeProfile(payload, user);
        if (!cancelled && Object.values(normalized).some(Boolean)) {
          updateProfile({
            ...normalized,
            source: 'database',
          });
          setProfileError('');
        }
      } catch {
        if (!cancelled) {
          if (!hasFallbackData) {
            setProfileError('Connected to login, but `profile.php` is missing or not returning the `users` row for this email.');
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

  const handleSave = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    updatePassword(password.trim());
    setPassword('');
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-10">
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
                    {loadingProfile ? 'Syncing profile' : profile?.source === 'database' ? 'Synced from XAMPP' : profile ? 'Profile cached' : 'Login identity only'}
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

          <Card className="rounded-[3rem] bg-surface dark:bg-surface-elevated border border-border p-6 md:p-8">
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
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSaved(false);
                }}
                placeholder="Enter new password"
                required
              />

              <Button type="submit" variant="primary" className="w-full py-4 rounded-2xl">
                Save Password
              </Button>
            </form>

            {saved && (
              <p className="mt-4 text-sm font-bold text-campus-green">
                Password updated successfully.
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Security Tip</p>
              <p className="text-sm text-foreground leading-relaxed">
                Use a strong password with at least 8 characters, mixing letters and numbers.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
