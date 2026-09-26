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
  Building2,
  Shield
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

  const citizenUsers = allUsers.filter((u) => u.role === 'Citizen');
  const officerUsers = allUsers.filter(
    (u) => u.role === 'Nodal Officer' || u.role === 'Support Admin'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl p-5 sm:p-7 border border-[#d8ded5] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f2] hover:bg-[#e7eae4] text-[#536157] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#126a50] flex items-center justify-center shrink-0 text-white font-black text-sm">
            BS
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-display text-[#1c2925] leading-tight">
              Bharat Support AI Portal
            </h2>
            <p className="text-xs text-[#536157]">
              {mode === 'login'
                ? 'Select a demo persona or sign in to your support desk'
                : 'Create a new citizen or government officer profile'}
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-[#f4f6f2] p-1 mb-5 border border-[#dce2d9]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1c2925] shadow-xs border border-[#dce2d9]'
                : 'text-[#536157] hover:text-[#1c2925]'
            }`}
          >
            Sign In / Persona Switcher
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#1c2925] shadow-xs border border-[#dce2d9]'
                : 'text-[#536157] hover:text-[#1c2925]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* 1-Click Showcase Persona Switcher */}
        <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-[#f7f9f6] border border-[#d8ded5] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-[#1c2925] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#126a50]" />
              <span>Instant Persona Switcher (For Live Demos)</span>
            </div>
            <span className="text-[10px] text-[#126a50] font-bold">1-Click Switch</span>
          </div>

          {/* Citizen Section */}
          <div>
            <div className="text-[10px] font-bold text-[#536157] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User size={11} className="text-[#126a50]" />
              <span>Citizen Profiles (Public User View)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {citizenUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.id)}
                  className="p-2 rounded-lg bg-white hover:bg-[#edf4f0] border border-[#d8ded5] hover:border-[#126a50] shadow-2xs transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#126a50] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      {user.avatarInitials}
                    </div>
                    <div className="text-[11px] font-bold text-[#1c2925] truncate group-hover:text-[#126a50]">
                      {user.name}
                    </div>
                  </div>
                  <div className="text-[9px] text-[#536157] truncate pl-6">
                    {user.state} • Citizen
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Officer & Admin Section */}
          <div>
            <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Shield size={11} className="text-rose-700" />
              <span>Nodal Officer & Admin Desks (Government Portal)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {officerUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.id)}
                  className="p-2 rounded-lg bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200 hover:border-rose-400 shadow-2xs transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-5 h-5 rounded-full bg-rose-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      {user.avatarInitials}
                    </div>
                    <div className="text-[11px] font-bold text-rose-950 truncate group-hover:text-rose-900">
                      {user.name}
                    </div>
                  </div>
                  <div className="text-[9px] text-rose-700 font-medium truncate pl-6">
                    {user.role} • {user.state}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#1c2925] mb-1">
                Email Address or Username
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. umair.khan@bsai.gov.in"
                  className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                  required
                />
                <Mail className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2925] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                />
                <Lock className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#126a50] hover:bg-[#0d503d] py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-3 transition-colors shadow-2xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSignup} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Verma"
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                    required
                  />
                  <User className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya.verma@bsai.gov.in"
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                  />
                  <Phone className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  State / Territory
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20 cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2925] mb-1">
                  Account Type / Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-[#d8ded5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20 cursor-pointer"
                  >
                    <option value="Citizen">Citizen User (Public Services)</option>
                    <option value="Nodal Officer">District Nodal Officer (Govt Officer)</option>
                    <option value="Support Admin">Platform Administrator</option>
                  </select>
                  <Building2 className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#126a50] hover:bg-[#0d503d] py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-3 transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
