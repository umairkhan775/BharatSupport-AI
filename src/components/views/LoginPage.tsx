import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage, UserRole } from '../../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../data/i18n';
import {
  Shield,
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
  Bot,
  Compass,
  ArrowLeft,
  FileCheck2,
  Award,
  KeyRound,
  Fingerprint
} from 'lucide-react';

interface LoginPageProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNavigate: (view: string) => void;
}

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

export const LoginPage: React.FC<LoginPageProps> = ({
  currentLanguage,
  onLanguageChange,
  onNavigate,
}) => {
  const {
    login,
    signup,
    allUsers,
    switchUser,
    currentUser,
    isAuthenticated
  } = useAuth();

  const [authTab, setAuthTab] = useState<'citizen' | 'officer' | 'register'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('New Delhi');
  const [role, setRole] = useState<UserRole>('Citizen');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(currentLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const citizenUsers = allUsers.filter((u) => u.role === 'Citizen');
  const officerUsers = allUsers.filter(
    (u) => u.role === 'Nodal Officer' || u.role === 'Support Admin'
  );

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email or identity credential');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      await login(email, password);
      setSuccessMsg('Authentication successful! Redirecting to workspace...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please provide your full name and official email');
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
        preferredLanguage: prefLang,
      });
      setSuccessMsg('Account created successfully! Welcome to Bharat Support AI.');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPersonaSelect = (userId: string) => {
    switchUser(userId);
    setSuccessMsg('Persona activated! Loading workspace...');
    setTimeout(() => {
      onNavigate('dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7f8f5] text-[#1c2925] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Return to Portal */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-xs font-bold text-[#536157] hover:text-[#126a50] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#d8ded5] shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Return to Portal Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Globe size={14} className="text-[#126a50]" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-white border border-[#d8ded5] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1c2925] cursor-pointer focus:outline-none focus:border-[#126a50]"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Col: Brand Credentials & Impact Highlights (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1C2925] via-[#153e34] to-[#0b4634] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle watermark logo pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <img src="/bsai-logo.jpg" alt="" className="w-80 h-80 rounded-full object-cover" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 text-[#cbe3d7]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Digital India Citizen Gateway
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/bsai-logo.jpg"
                  alt="BSAI Mascot"
                  className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-md"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                    Bharat Support <span className="text-[#f59e0b]">AI</span>
                  </h1>
                  <p className="text-xs text-[#a4cebd] font-medium">
                    National Intelligent Citizen Support Desk
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mt-3">
                Unified single-window AI assistance for Central & State Government Schemes, Direct Benefit Transfers (DBT), DigiLocker verified documents, and DARPG Grievance Redressal.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                <Bot className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">
                    24/7 Multi-Lingual AI Intelligence
                  </div>
                  <div className="text-[11px] text-white/70 leading-snug">
                    Natural vernacular voice & text support across 8 Indian languages.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                <FileCheck2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Official Scheme Verification
                  </div>
                  <div className="text-[11px] text-white/70 leading-snug">
                    Real-time status for PM-Kisan, Ayushman Bharat, NSP, and PMKVY.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Nodal Grievance Redressal
                  </div>
                  <div className="text-[11px] text-white/70 leading-snug">
                    Automated SLA escalation to District Nodal Officers with ticket tracking.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Metrics */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-base font-black text-white">1,428+</div>
              <div className="text-[9px] text-white/70 uppercase">Citizen Queries</div>
            </div>
            <div>
              <div className="text-base font-black text-emerald-300">94.2%</div>
              <div className="text-[9px] text-white/70 uppercase">Resolution Rate</div>
            </div>
            <div>
              <div className="text-base font-black text-amber-300">&lt; 0.5s</div>
              <div className="text-[9px] text-white/70 uppercase">Response Time</div>
            </div>
          </div>
        </div>

        {/* Right Col: Authentication Portal & Persona Selector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#d8ded5] shadow-lg flex flex-col justify-between">
          <div>
            {/* Header Persona Switch Tabs */}
            <div className="flex rounded-2xl bg-[#f4f6f2] p-1.5 mb-6 border border-[#dce2d9]">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('citizen');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'citizen'
                    ? 'bg-white text-[#126a50] shadow-xs border border-[#dce2d9]'
                    : 'text-[#536157] hover:text-[#1c2925]'
                }`}
              >
                <User size={14} />
                <span>Citizen Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('officer');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'officer'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-[#536157] hover:text-rose-900'
                }`}
              >
                <Shield size={14} />
                <span>Nodal Officer / Admin Desk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-white text-[#1c2925] shadow-xs border border-[#dce2d9]'
                    : 'text-[#536157] hover:text-[#1c2925]'
                }`}
              >
                <Sparkles size={14} />
                <span>New Registration</span>
              </button>
            </div>

            {/* Status Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1-Click Interactive Demo Persona Cards */}
            <div className="mb-6 p-4 rounded-2xl bg-[#f8faf7] border border-[#dce2d9] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#1c2925] uppercase tracking-wider">
                  <Fingerprint className="w-4 h-4 text-[#126a50]" />
                  <span>1-Click Live Showcase Personas</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e4ede7] text-[#126a50] font-bold">
                  Instant Access
                </span>
              </div>

              {authTab === 'officer' ? (
                /* Officer Personas */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {officerUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickPersonaSelect(user.id)}
                      className="p-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/90 border border-rose-200 hover:border-rose-400 transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-7 h-7 rounded-full bg-rose-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.avatarInitials}
                        </div>
                        <div className="truncate min-w-0">
                          <div className="text-xs font-black text-rose-950 truncate group-hover:text-rose-900">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-rose-700 font-semibold truncate">
                            {user.role} • {user.state}
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] text-[#536157] font-mono truncate pl-9">
                        {user.email}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Citizen Personas */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {citizenUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickPersonaSelect(user.id)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#edf6f1] border border-[#d8ded5] hover:border-[#126a50] transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#126a50] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {user.avatarInitials}
                        </div>
                        <div className="truncate min-w-0">
                          <div className="text-xs font-black text-[#1c2925] truncate group-hover:text-[#126a50]">
                            {user.name}
                          </div>
                          <div className="text-[9px] text-[#536157] truncate">
                            {user.state} • Citizen
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] text-[#79827c] font-mono truncate pl-8">
                        {user.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Forms */}
            {authTab === 'register' ? (
              /* Registration Form */
              <form onSubmit={handleManualSignup} className="space-y-3.5">
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
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                        required
                      />
                      <User className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c2925] mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh.kumar@bsai.gov.in"
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                        required
                      />
                      <Mail className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1c2925] mb-1">
                      Mobile Number (For OTP Verification)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                      />
                      <Phone className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c2925] mb-1">
                      State / Union Territory
                    </label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] cursor-pointer"
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
                      Account Type / Role
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] cursor-pointer"
                      >
                        <option value="Citizen">Citizen User (Beneficiary)</option>
                        <option value="Nodal Officer">District Nodal Officer (Govt)</option>
                        <option value="Support Admin">Field Support Admin</option>
                      </select>
                      <Building2 className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c2925] mb-1">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <select
                        value={prefLang}
                        onChange={(e) => setPrefLang(e.target.value as SupportedLanguage)}
                        className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] cursor-pointer"
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#126a50] hover:bg-[#0d503d] py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-4 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Creating Profile...' : 'Complete Digital India Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Sign In Form (Citizen or Officer) */
              <form onSubmit={handleManualLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1c2925] mb-1">
                    {authTab === 'officer'
                      ? 'Government Nodal Email (.gov.in / .nic.in)'
                      : 'Citizen Registered Email / Username'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        authTab === 'officer'
                          ? 'e.g. amit.patel@nodal.gov.in'
                          : 'e.g. umair.khan@bsai.gov.in'
                      }
                      className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                      required
                    />
                    <Mail className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#1c2925]">
                      Password / Security PIN
                    </label>
                    <span className="text-[10px] text-[#126a50] font-bold hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fbfcf9] border border-[#d8ded5] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1c2925] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20"
                    />
                    <Lock className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-4 transition-colors shadow-xs ${
                    authTab === 'officer'
                      ? 'bg-rose-800 hover:bg-rose-900'
                      : 'bg-[#126a50] hover:bg-[#0d503d]'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? 'Authenticating...'
                      : authTab === 'officer'
                      ? 'Sign In to District Nodal Desk'
                      : 'Sign In to Citizen Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Security Notice */}
          <div className="pt-6 mt-6 border-t border-[#e7e9e2] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#79827c]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#126a50]" />
              <span>256-Bit SSL Encrypted • MeitY & NIC Security Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <span>National Citizen Helpline: <strong>1800-11-0031</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
