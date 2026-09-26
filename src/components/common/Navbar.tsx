import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage } from '../../types';
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
  ChevronDown
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

  const isLanding = activeView === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-xl border-b border-white/80 px-4 lg:px-8 py-2.5 shadow-md shadow-teal-950/5 transition-all">
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
            <div className="font-extrabold font-display text-sm sm:text-base tracking-tight text-bsai-indigo leading-none">
              Bharat Support <span className="text-bsai-saffron">AI</span>
            </div>
            <div className="brand-tagline text-[10px] font-medium text-bsai-indigoMuted">
              AI-Powered Customer Support for a Digital India
            </div>
          </div>
        </div>

        {/* Center: Landing Links or Dashboard Search Bar */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-bsai-indigoLight">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-bsai-indigo hover:text-bsai-emerald transition-colors cursor-pointer"
            >
              Command Center
            </button>
            <a href="#how-it-works" className="hover:text-bsai-emerald transition-colors">
              How BSAI Works
            </a>
            <a href="#services" className="hover:text-bsai-emerald transition-colors">
              Services & Impact
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
              placeholder="Search anything..."
              className="w-full bg-white/70 hover:bg-white border border-emerald-200/80 rounded-full pl-10 pr-4 py-2 text-xs text-bsai-indigo placeholder-bsai-indigoMuted focus:outline-none focus:border-bsai-teal focus:ring-2 focus:ring-teal-400/30 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-bsai-indigoMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        )}

        {/* Right Navigation & Profile Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Language Selector 3D Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-emerald-200/80 rounded-full px-3 py-1.5 text-xs font-bold text-bsai-indigo shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-bsai-teal" />
              <span>{currentLangObj.nativeName}</span>
              <span className="text-[9px] text-bsai-indigoMuted">▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl border border-emerald-200/80 rounded-2xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-bsai-indigo hover:bg-emerald-50 flex items-center justify-between transition-colors"
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-bsai-indigoMuted uppercase font-mono">
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
              className="text-xs font-bold text-bsai-indigoMuted hover:text-bsai-teal hidden md:block transition-colors cursor-pointer"
            >
              Landing Page
            </button>
          )}

          {/* If Authenticated: Notifications + Dynamic Profile */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Dynamic Notification Tray */}
              <div className="nav-notifications relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full bg-white/80 hover:bg-white border border-emerald-200/80 text-bsai-indigoMuted hover:text-bsai-indigo shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative cursor-pointer"
                  title="Citizen Notifications"
                >
                  <Bell className="w-4 h-4 text-bsai-indigo" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs shadow-rose-500/50 animate-pulse">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl border border-cyan-200/90 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-black text-bsai-indigo">
                        <Bell className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Notifications for {currentUser.name.split(' ')[0]}</span>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] text-cyan-700 font-bold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
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
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                              notif.read
                                ? 'bg-slate-50/60 border-slate-100 opacity-75'
                                : 'bg-cyan-50/70 border-cyan-200/80 shadow-xs hover:bg-cyan-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="text-[11px] font-black text-bsai-indigo">
                                {notif.title}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-snug">
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
                  className="flex items-center gap-2 pl-2 border-l border-emerald-200/60 cursor-pointer group"
                >
                  {/* Dynamic Avatar Initials with Role Ring */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#063F46] via-[#087F6A] to-[#159A9C] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-teal-900/20 ring-2 ring-cyan-300/80 group-hover:scale-105 transition-transform shrink-0">
                    {currentUser.avatarInitials}
                  </div>

                  {/* Dynamic User Name & Role */}
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-black text-bsai-indigo leading-tight flex items-center gap-1 group-hover:text-bsai-teal transition-colors">
                      <span className="truncate max-w-[130px]">{currentUser.name}</span>
                      <ChevronDown className="w-3 h-3 text-bsai-indigoMuted" />
                    </div>
                    <div className="text-[10px] text-bsai-indigoMuted">
                      {currentUser.role === 'Citizen' ? 'User / Citizen' : currentUser.role}
                    </div>
                  </div>
                </button>

                {/* Profile Action Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-cyan-200/90 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
                    {/* User Card Header */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 border border-cyan-200/60 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                        {currentUser.avatarInitials}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-bsai-indigo truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {currentUser.email}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[9px] font-black">
                          {currentUser.role} • {currentUser.state || 'India'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('my-requests');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-bsai-indigo transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-cyan-600" />
                          <span>My Requests</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Active
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('support-requests');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-bsai-indigo transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-teal-600" />
                          <span>Support Requests</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-bsai-indigo transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Settings</span>
                        </div>
                      </button>
                    </div>

                    {/* Quick Citizen Profile Switcher in dropdown */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                        Switch Citizen Profile
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allUsers.slice(0, 4).map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setIsProfileOpen(false);
                            }}
                            className={`p-1.5 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                              u.id === currentUser.id
                                ? 'bg-cyan-100 border-cyan-300 text-cyan-900 font-black'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-cyan-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                              {u.avatarInitials}
                            </span>
                            <span className="text-[10px] truncate">{u.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Session</span>
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
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 rounded-full text-xs font-black text-bsai-indigo bg-white/80 hover:bg-white border border-emerald-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="btn-3d-emerald px-3.5 py-1.5 rounded-full text-xs font-black text-white flex items-center gap-1 shadow-md hover:scale-105 transition-transform cursor-pointer"
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
