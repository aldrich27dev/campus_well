import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  UserCog,
  ShieldCheck,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Card, Button, Input } from '../components/UI';
import { useSystem } from '../context/SystemContext';

const addressOptions = [
  'Caloocan City',
  'Valenzuela City',
  'Meycauayan, Bulacan',
  'Malabon City',
  'Manila City',
];

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

const Register = () => {
  const navigate = useNavigate();
  const { updateProfile } = useSystem();
  const [form, setForm] = useState({
    studentId: '',
    lastName: '',
    middleName: '',
    firstName: '',
    yearLevel: '',
    contactNumber: '',
    email: '',
    address: '',
  });
  const [middleNA, setMiddleNA] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);

  const emailPattern = useMemo(() => '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', []);
  const contactPattern = useMemo(() => '^09\\d{9}$', []);

  const filteredAddresses = addressOptions.filter((item) =>
    item.toLowerCase().includes(form.address.toLowerCase())
  );

  const normalizedAddress = form.address.trim();
  const selectedCity = addressOptions.some(
    (item) => item.toLowerCase() === normalizedAddress.toLowerCase()
  );
  const looksLikeFullAddress = normalizedAddress.length >= 25 && /[A-Za-z]/.test(normalizedAddress) && /\d/.test(normalizedAddress);
  const addressIsValid = looksLikeFullAddress && !selectedCity;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressIsValid) {
      setAddressTouched(true);
      return;
    }
    setShowPrivacyModal(true);
  };

  const confirmCreateAccount = () => {
    setShowPrivacyModal(false);
    setIsCreating(true);

    setTimeout(() => {
      const temporaryPassword = `CW-${Math.random().toString(36).slice(-8).toUpperCase()}`;
      updateProfile({
        ...form,
        middleName: middleNA ? 'N/A' : form.middleName,
        password: temporaryPassword,
        approved: false,
      });
      setSubmitted(true);
      setIsCreating(false);
      setShowSuccessModal(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-campus-blue transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2 p-8 md:p-10 rounded-[3rem] bg-muted/30 dark:bg-muted/20 border border-border">
            <div className="h-14 w-14 rounded-2xl bg-campus-blue/10 text-campus-blue dark:text-campus-green flex items-center justify-center mb-6">
              <UserCog size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground">
              Create Account
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Register a CampusWell profile so your access stays connected to your student record.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-border bg-surface dark:bg-surface-elevated p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">What we collect</p>
                <p className="mt-2 text-sm text-foreground">Student ID, name, contact, email, year level, and address.</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface dark:bg-surface-elevated p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Privacy note</p>
                <p className="mt-2 text-sm text-foreground">We handle your account details under the Philippine Data Privacy Act.</p>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 p-6 md:p-8 rounded-[3rem] bg-surface dark:bg-surface-elevated border border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Student ID"
                  value={form.studentId}
                  onChange={(e) => handleChange('studentId', e.target.value)}
                  placeholder="2024-00000"
                  inputMode="numeric"
                  required
                />
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Dela Cruz"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <div className="flex items-center gap-2 mb-2 ml-2">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                      Middle Name
                    </label>
                    <button
                      type="button"
                      aria-pressed={middleNA}
                      onClick={() => {
                        setMiddleNA(prev => {
                          const next = !prev;
                          setForm(current => ({ ...current, middleName: next ? 'N/A' : '' }));
                          return next;
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.16em] transition-all ${
                        middleNA
                          ? 'bg-campus-blue text-primary-foreground border-campus-blue shadow-soft'
                          : 'bg-muted/30 dark:bg-muted/20 text-muted-foreground border-border hover:border-campus-blue hover:text-campus-blue'
                      }`}
                    >
                      <ShieldCheck size={10} />
                      N/A
                    </button>
                  </div>
                  <input
                    value={middleNA ? '' : form.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    disabled={middleNA}
                    placeholder={middleNA ? 'Not applicable' : 'Optional'}
                    className="w-full px-5 py-3.5 bg-surface/80 dark:bg-surface-elevated/70 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-ring focus:border-campus-blue text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 font-bold text-sm disabled:opacity-60"
                  />
                </div>

                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Juan"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-2">
                    Year Level
                  </label>
                  <div className="relative">
                    <select
                      value={form.yearLevel}
                      onChange={(e) => handleChange('yearLevel', e.target.value)}
                      required
                      className="w-full appearance-none px-5 py-3.5 bg-surface/80 dark:bg-surface-elevated/70 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-ring focus:border-campus-blue text-foreground transition-all duration-300 font-bold text-sm"
                    >
                      <option value="" disabled>
                        Select year level
                      </option>
                      {yearLevels.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  </div>
                </div>

                <Input
                  label="Contact Number"
                  value={form.contactNumber}
                  onChange={(e) => handleChange('contactNumber', e.target.value)}
                  placeholder="09XXXXXXXXX"
                  inputMode="tel"
                  pattern={contactPattern}
                  title="Use a valid PH mobile number format starting with 09 and 11 digits total."
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="student@grc.edu.ph"
                pattern={emailPattern}
                title="Enter a valid email address."
                required
              />

              <div className="relative">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    value={form.address}
                    onChange={(e) => {
                      handleChange('address', e.target.value);
                      setIsAddressOpen(true);
                      setAddressTouched(true);
                    }}
                    onFocus={() => setIsAddressOpen(true)}
                    onBlur={() => setTimeout(() => setIsAddressOpen(false), 140)}
                    placeholder="Start typing your full address"
                    className="w-full pl-12 pr-5 py-3.5 bg-surface/80 dark:bg-surface-elevated/70 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-ring focus:border-campus-blue text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 font-bold text-sm"
                    required
                  />
                </div>

                <AnimatePresence>
                  {isAddressOpen && form.address.trim() !== '' && filteredAddresses.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 right-0 top-[calc(100%+3.5rem)] z-20 bg-surface dark:bg-surface-elevated border border-border rounded-[1.5rem] shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border bg-muted/30 dark:bg-muted/20">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Suggestions</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Pick a location to help you start, then keep typing the rest of the address.
                        </p>
                      </div>
                      <div className="p-2">
                        {filteredAddresses.map((address) => (
                          <button
                            key={address}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              handleChange('address', `${address}, `);
                              setAddressTouched(true);
                              setIsAddressOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-foreground hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors flex items-center gap-2"
                          >
                            <MapPin size={14} className="text-campus-blue dark:text-campus-green shrink-0" />
                            <span>{address}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-2 text-[10px] text-muted-foreground ml-2">
                  Please enter your full address, not just the city or area.
                </p>
                {addressTouched && !addressIsValid && (
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 ml-2">
                    Full address required. Include street, building, or lot details.
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  disabled={isCreating || !addressIsValid}
                >
                  <CheckCircle2 size={16} /> Register
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto px-8 py-4 rounded-2xl" onClick={() => navigate('/')}>
                  Cancel
                </Button>
              </div>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-campus-green"
                >
                  Registration submitted. Returning to login...
                </motion.p>
              )}
            </form>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/65 backdrop-blur-sm"
              onClick={() => setShowPrivacyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="relative w-full max-w-lg rounded-[2.5rem] bg-surface dark:bg-surface-elevated border border-border shadow-2xl p-6 md:p-8"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-campus-blue/10 text-campus-blue dark:text-campus-green flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                    Data Privacy Notice
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    By creating an account, you acknowledge that CampusWell will access, store, and process your personal information for student support services in accordance with the Philippine Data Privacy Act.
                  </p>
                  <p className="mt-3 text-sm text-foreground font-medium">
                    Do you want to continue creating your account?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  onClick={confirmCreateAccount}
                >
                  I Agree and Continue
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  Not Now
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg rounded-[2.5rem] bg-surface dark:bg-surface-elevated border border-border shadow-2xl p-6 md:p-8 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-campus-green/10 text-campus-green flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="mt-4 text-xl font-black uppercase italic tracking-tighter text-foreground">
                Account Registered
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                If your GRC student details are successfully verified, please check your email address for the confirmation message that your account has been successfully registered.
              </p>
              <div className="mt-4 rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4 text-sm text-foreground leading-relaxed">
                For your security, please change the password after your first login. A temporary password will be sent to your email address.
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                >
                  Back to Login
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
