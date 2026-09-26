import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, UserRole } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/i18n';
import {
  Bot,
  Globe,
  ArrowRight,
  Search,
  Bell,
  User,
  LogOut,
  UserCheck,
  Settings,
  Inbox,
  Sparkles,
  Check,
  CheckCircle2,
  ChevronDown,
  Shield,
  ArrowLeftRight,
  BarChart3,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { BSAIButton } from './BSAIButton';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onQuickSearch?: (query: string) => void;
  onResetDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeView,
  onNavigate,
  onQuickSearch,
  onResetDemo,
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    allUsers,
    switchUser,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isOfficerOrAdmin =
    currentUser?.role === 'Nodal Officer' || currentUser?.role === 'Support Admin';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onQuickSearch) {
      onQuickSearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    onNavigate('landing');
  };

  const handleToggleDemoRole = () => {
    if (isOfficerOrAdmin) {
      const citizen = allUsers.find((u) => u.role === 'Citizen') || allUsers[0];
      if (citizen) {
        switchUser(citizen.id);
        onNavigate('dashboard');
      }
    } else {
      const officer =
        allUsers.find((u) => u.role === 'Nodal Officer') ||
        allUsers.find((u) => u.role === 'Support Admin') ||
        allUsers[3];
      if (officer) {
        switchUser(officer.id);
        onNavigate('dashboard');
      }
    }
  };

  const isLanding = activeView === 'landing';

  const citizenUsers = allUsers.filter((u) => u.role === 'Citizen');
  const officerUsers = allUsers.filter(
    (u) => u.role === 'Nodal Officer' || u.role === 'Support Admin'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-[#e7e9e2] px-4 lg:px-8 py-2.5 shadow-xs transition-all">
      <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
        {/* BSAI Brand Logo & Title */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <img
            src="/bsai-logo.jpg"
            alt="Bharat Support AI Mascot Logo"
            className="w-9 h-9 rounded-lg object-contain bg-white border border-[#e7e9e2] p-0.5 shadow-xs"
          />
          <div>
            <div className="font-extrabold font-display text-sm sm:text-base tracking-tight text-[#1c2925] leading-none">
              Bharat Support <span className="text-[#c25e00]">AI</span>
            </div>
            <div className="brand-tagline text-[10px] font-medium text-[#79827c]">
              AI Citizen Support Platform for Digital India
            </div>
          </div>
        </div>

        {/* Center: Landing Links or Dashboard Search Bar */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#536157]">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#126a50] hover:text-[#0b4634] transition-colors cursor-pointer"
            >
              {isOfficerOrAdmin ? 'Command Center' : 'Citizen Portal'}
            </button>
            <a href="#how-it-works" className="hover:text-[#126a50] transition-colors">
              How BSAI Works
            </a>
            <a href="#services" className="hover:text-[#126a50] transition-colors">
              Services & Schemes
            </a>
          </nav>
        ) : (
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl mx-2 sm:mx-6 relative hidden sm:block"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isOfficerOrAdmin
                  ? "Search tickets, complaints, or telemetry..."
                  : "Search government schemes, scholarships, health cards..."
              }
              className="w-full bg-[#f6f8f5] hover:bg-white border border-[#d8ded5] rounded-full pl-10 pr-4 py-2 text-xs text-[#1c2925] placeholder-[#79827c] focus:outline-none focus:border-[#126a50] focus:ring-2 focus:ring-[#126a50]/20 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-[#79827c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        )}

        {/* Right Navigation & Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Mode Pill with 1-Click Role Switch */}
          {isAuthenticated && currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#f4f6f2] border border-[#dce2d9] rounded-full px-2.5 py-1 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOfficerOrAdmin ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span className="font-bold text-[11px] text-[#1c2925]">
                {isOfficerOrAdmin ? 'Officer Desk' : 'Citizen'}
              </span>
              <button
                onClick={handleToggleDemoRole}
                className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white hover:bg-[#e4ede7] border border-[#ced8cd] text-[#126a50] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="Switch between Citizen and Nodal Officer view for demo"
              >
                <ArrowLeftRight size={10} />
                <span>{isOfficerOrAdmin ? 'Citizen View' : 'Officer Desk'}</span>
              </button>
            </div>
          )}

          {/* Language Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 bg-white hover:bg-[#f6f8f5] border border-[#d8ded5] rounded-full px-3 py-1.5 text-xs font-bold text-[#1c2925] shadow-xs transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#126a50]" />
              <span>{currentLangObj.nativeName}</span>
              <span className="text-[9px] text-[#79827c]">▼</span>
            </button>

            {/* Language Dropdown */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#d8ded5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#79827c] uppercase tracking-wider border-b border-[#f0f3ee] mb-1">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      lang.code === currentLanguage
                        ? 'bg-[#126a50] text-white font-bold'
                        : 'text-[#1c2925] hover:bg-[#f0f3ee]'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] uppercase font-mono opacity-80">
                      {lang.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Landing Page link */}
          {!isLanding && (
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs font-bold text-[#536157] hover:text-[#126a50] hidden md:block transition-colors cursor-pointer"
            >
              Home
            </button>
          )}

          {/* If Authenticated: Notifications + Dynamic Profile */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Dynamic Notification Tray */}
              <div className="nav-notifications relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full bg-white hover:bg-[#f6f8f5] border border-[#d8ded5] text-[#536157] hover:text-[#1c2925] shadow-xs transition-all relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#1c2925]" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white border border-[#d8ded5] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0f3ee]">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#1c2925]">
                        <Bell className="w-3.5 h-3.5 text-[#126a50]" />
                        <span>Notifications for {currentUser.name.split(' ')[0]}</span>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] text-[#126a50] font-bold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#79827c]">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.ticketId) onNavigate('my-requests');
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              notif.read
                                ? 'bg-[#f7f8f5] border-[#e7e9e2] opacity-75'
                                : 'bg-[#edf6f2] border-[#cbe3d7] shadow-2xs hover:bg-[#e4f1eb]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="text-[11px] font-black text-[#1c2925]">
                                {notif.title}
                              </span>
                              <span className="text-[9px] font-mono text-[#79827c] shrink-0">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#536157] leading-snug">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic User Profile Badge & Dropdown */}
              <div className="nav-profile relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-[#d8ded5] cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 shrink-0 ${
                      isOfficerOrAdmin
                        ? 'bg-gradient-to-tr from-rose-900 to-rose-700 ring-rose-300'
                        : 'bg-gradient-to-tr from-[#0b4634] to-[#126a50] ring-emerald-300'
                    }`}
                  >
                    {currentUser.avatarInitials}
                  </div>

                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-black text-[#1c2925] leading-tight flex items-center gap-1 group-hover:text-[#126a50] transition-colors">
                      <span className="truncate max-w-[130px]">{currentUser.name}</span>
                      <ChevronDown className="w-3 h-3 text-[#79827c]" />
                    </div>
                    <div className="text-[10px] text-[#79827c]">
                      {currentUser.role === 'Citizen' ? 'Citizen Profile' : currentUser.role}
                    </div>
                  </div>
                </button>

                {/* Profile Action Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-[#d8ded5] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
                    {/* User Card Header */}
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        isOfficerOrAdmin
                          ? 'bg-rose-50/70 border-rose-200'
                          : 'bg-[#f4f7f4] border-[#dbe4d9]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ${
                          isOfficerOrAdmin ? 'bg-rose-800' : 'bg-[#126a50]'
                        }`}
                      >
                        {currentUser.avatarInitials}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="text-xs font-black text-[#1c2925] truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-[#536157] truncate">
                          {currentUser.email}
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-black ${
                            isOfficerOrAdmin
                              ? 'bg-rose-200 text-rose-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {currentUser.role} • {currentUser.state || 'India'}
                        </span>
                      </div>
                    </div>

                    {/* Role-Specific Quick Links */}
                    <div className="space-y-1">
                      {isOfficerOrAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('dashboard');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <Compass className="w-4 h-4 text-[#126a50]" />
                            <span>Command Center</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('support-requests');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <Inbox className="w-4 h-4 text-teal-700" />
                            <span>All Support Requests</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('escalations');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Escalations Queue</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('settings');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-[#79827c]" />
                            <span>System Settings</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('dashboard');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <Compass className="w-4 h-4 text-[#126a50]" />
                            <span>Citizen Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('my-requests');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4 text-[#126a50]" />
                            <span>My Requests & Grievances</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('ai-assistant');
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#1c2925] hover:bg-[#f0f3ee] transition-colors cursor-pointer"
                          >
                            <Bot className="w-4 h-4 text-[#126a50]" />
                            <span>24/7 AI Assistant</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Citizen Profiles Section */}
                    <div className="pt-2 border-t border-[#e7e9e2]">
                      <div className="text-[10px] font-black text-[#79827c] uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
                        <span>👤 Citizen Profiles</span>
                        <span className="text-[9px] font-normal text-[#536157]">Public Users</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {citizenUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setIsProfileOpen(false);
                              onNavigate('dashboard');
                            }}
                            className={`p-1.5 rounded-lg border text-left flex items-center gap-1 transition-all cursor-pointer ${
                              u.id === currentUser.id
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-[#f7f8f5] hover:bg-[#edf2ea] border-[#d8ded5] text-[#1c2925]'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-[#126a50] text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                              {u.avatarInitials}
                            </span>
                            <span className="text-[10px] truncate">{u.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Officer & Admin Desks Section */}
                    <div className="pt-2 border-t border-[#e7e9e2]">
                      <div className="text-[10px] font-black text-rose-800 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
                        <span>🛡️ Officer / Admin Desks</span>
                        <span className="text-[9px] font-normal text-rose-700">Govt Support</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {officerUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setIsProfileOpen(false);
                              onNavigate('dashboard');
                            }}
                            className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                              u.id === currentUser.id
                                ? 'bg-rose-100 border-rose-300 text-rose-950 font-bold'
                                : 'bg-rose-50/50 hover:bg-rose-100/60 border-rose-200 text-rose-900'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-rose-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                              {u.avatarInitials}
                            </span>
                            <div className="truncate min-w-0">
                              <div className="text-[10px] font-bold truncate">
                                {u.name.split(' ')[0]}
                              </div>
                              <div className="text-[8px] text-rose-700 truncate">
                                {u.role === 'Support Admin' ? 'Admin HQ' : 'Nodal Officer'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-[#e7e9e2]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Unauthenticated / Login Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1c2925] bg-white hover:bg-[#f6f8f5] border border-[#d8ded5] shadow-xs transition-all cursor-pointer"
              >
                Sign In / Login
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#126a50] hover:bg-[#0e5641] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
