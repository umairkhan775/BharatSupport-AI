import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage, UserRole } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/i18n';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';

const INDIAN_STATES = [
  'New Delhi',
  'Uttar Pradesh',
  'Maharashtra',
  'Gujarat',
  'Bihar',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Telangana',
  'Andhra Pradesh',
  'Assam',
  'Odisha',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    allUsers,
    switchUser,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('New Delhi');
  const [role, setRole] = useState<UserRole>('Citizen');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode with context
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      await login(email, password);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please provide your name and email address');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      await signup({
        name,
        email,
        phone,
        state,
        password,
        role,
        preferredLanguage,
      });
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-cyan-300/80 shadow-[0_20px_50px_rgba(14,165,233,0.3)] animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#e8efe7] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-xs text-bsai-indigo font-display">
              BSAI
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-display text-bsai-indigo leading-tight">
              Bharat Support AI Citizen Portal
            </h2>
            <p className="text-xs text-bsai-indigoMuted">
              {mode === 'login'
                ? 'Sign in to access your personalized citizen support desk'
                : 'Create your Digital India citizen account'}
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-bsai-indigo shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-bsai-indigo'
            }`}
          >
            Citizen Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-bsai-indigo shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-bsai-indigo'
            }`}
          >
            Create Citizen Account
          </button>
        </div>

        {/* 1-Click Instant Demo Profiles (Quick Multi-User Switcher) */}
        <div className="mb-5 p-3 sm:p-3.5 rounded-lg bg-[#f2f5ef] border border-[#e2e9e1]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-bsai-indigo uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Instant Demo Profiles (1-Click Switch)</span>
            </div>
            <span className="text-[10px] text-teal-700 font-bold">Try different citizens</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {allUsers.slice(0, 4).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.id)}
                className="p-2 rounded-xl bg-white hover:bg-cyan-50/80 border border-cyan-100 hover:border-cyan-300 shadow-xs hover:shadow-md transition-all text-left group hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#47705a] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.avatarInitials}
                  </div>
                  <div className="text-[11px] font-black text-bsai-indigo truncate group-hover:text-cyan-700">
                    {user.name.split(' ')[0]}
                  </div>
                </div>
                <div className="text-[9px] font-medium text-slate-500 truncate">
                  {user.role}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-bsai-indigo mb-1">
                Citizen Email or Username
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@bsai.gov.in"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-bsai-indigo mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#126a50] hover:bg-[#0d503d] py-2.5 rounded-md text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer mt-4 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSignup} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Verma"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya.verma@bsai.gov.in"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  State / Territory
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-bsai-indigo mb-1">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                  >
                    <option value="Citizen">Citizen / Beneficiary</option>
                    <option value="Nodal Officer">District Nodal Officer</option>
                    <option value="Support Admin">Field Support Admin</option>
                  </select>
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#126a50] hover:bg-[#0d503d] py-2.5 rounded-md text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer mt-4 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Creating Account...' : 'Complete Citizen Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
