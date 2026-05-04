import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, UserRound, Mail, Hash, MapPin, GraduationCap } from 'lucide-react';
import { Card, Button, Input } from '../components/UI';
import { useSystem } from '../context/SystemContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, updatePassword } = useSystem();
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const details = {
    studentId: profile?.studentId || 'N/A',
    lastName: profile?.lastName || user?.name?.split(' ')?.slice(-1)?.[0] || 'N/A',
    middleName: profile?.middleName || 'N/A',
    firstName: profile?.firstName || user?.name?.split(' ')?.[0] || 'N/A',
    yearLevel: profile?.yearLevel || 'N/A',
    contactNumber: profile?.contactNumber || 'N/A',
    email: profile?.email || user?.email || 'N/A',
    address: profile?.address || 'N/A',
    role: user?.role || 'student',
  };

  useEffect(() => {
    setSaved(false);
  }, [user, profile]);

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
                <p className="text-sm font-bold text-foreground">{`${details.firstName} ${details.middleName !== 'N/A' ? details.middleName : ''} ${details.lastName}`.replace(/\s+/g, ' ').trim()}</p>
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              <Button type="submit" variant="primary" className="w-full py-4 rounded-2xl">
                Save Password
              </Button>
            </form>

            {saved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm font-bold text-campus-green">
                Password updated successfully.
              </motion.p>
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
