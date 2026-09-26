import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  UserCheck,
  Inbox,
  BookOpen,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronRight,
  Compass,
  Shield,
  User,
  ArrowLeftRight,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { api } from '../../services/api';
import { getTranslation } from '../../data/i18n';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentLanguage: SupportedLanguage;
  escalatedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  currentLanguage,
  escalatedCount: escalatedCountProp,
}) => {
  const { currentUser, switchUser, allUsers } = useAuth();
  const [escalatedCount, setEscalatedCount] = useState(escalatedCountProp ?? 0);
  const [citizenOpenTickets, setCitizenOpenTickets] = useState(0);

  const isOfficerOrAdmin =
    currentUser?.role === 'Nodal Officer' || currentUser?.role === 'Support Admin';

  useEffect(() => {
    if (escalatedCountProp !== undefined) {
      setEscalatedCount(escalatedCountProp);
      return;
    }
    api.getAnalytics()
      .then((summary) => setEscalatedCount(summary.escalatedQueries))
      .catch(() => setEscalatedCount(0));

    // Also get citizen's own open count
    api.getTickets().then((tickets) => {
      if (currentUser && currentUser.role === 'Citizen') {
        const count = tickets.filter(
          (t) =>
            t.status !== 'Resolved' &&
            ((t.userId && t.userId === currentUser.id) ||
              (t.citizenName &&
                t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])))
        ).length;
        setCitizenOpenTickets(count);
      }
    }).catch(() => {});
  }, [escalatedCountProp, currentUser]);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Role-specific navigation items
  const citizenNavItems = [
    { id: 'landing', label: t('nav_landing') || 'Portal Home', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Citizen Dashboard', icon: Compass },
    { id: 'ai-assistant', label: t('nav_ai_assistant') || 'AI Assistant 24/7', icon: Bot },
    {
      id: 'my-requests',
      label: t('nav_my_requests') || 'My Requests & Grievances',
      icon: UserCheck,
      badge: citizenOpenTickets > 0 ? `${citizenOpenTickets} active` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    { id: 'knowledge-base', label: t('nav_knowledge_base') || 'Schemes & Guidelines', icon: BookOpen },
    { id: 'settings', label: t('nav_settings') || 'Settings & AI Key', icon: Settings },
  ];

  const officerNavItems = [
    { id: 'landing', label: t('nav_landing') || 'Portal Home', icon: LayoutDashboard },
    { id: 'dashboard', label: t('nav_command_center') || 'Command Center', icon: Compass },
    { id: 'ai-assistant', label: 'AI Copilot & Query Tester', icon: Bot },
    { id: 'support-requests', label: t('nav_support_requests') || 'All Support Requests', icon: Inbox },
    {
      id: 'escalations',
      label: t('nav_escalations') || 'Escalations Queue',
      icon: AlertTriangle,
      badge: escalatedCount > 0 ? `${escalatedCount} urgent` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    { id: 'analytics', label: t('nav_analytics') || 'Service Analytics', icon: BarChart3 },
    { id: 'knowledge-base', label: t('nav_knowledge_base') || 'Knowledge Management', icon: BookOpen },
    { id: 'settings', label: t('nav_settings') || 'System & AI Settings', icon: Settings },
  ];

  const activeNavList = isOfficerOrAdmin ? officerNavItems : citizenNavItems;

  const handleToggleDemoRole = () => {
    if (isOfficerOrAdmin) {
      // Switch to Citizen (Umair Khan)
      const citizen = allUsers.find((u) => u.role === 'Citizen') || allUsers[0];
      if (citizen) {
        switchUser(citizen.id);
        onNavigate('dashboard');
      }
    } else {
      // Switch to Nodal Officer (Amit Patel) or Admin
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

  return (
    <aside className="w-60 lg:w-64 bg-white border border-[#e7e9e2] rounded-xl p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-85px)] sticky top-[75px] z-20 overflow-y-auto shadow-sm">
      {/* Navigation Group */}
      <div>
        {/* Profile Mode Banner */}
        <div className="mb-3 px-2 py-2 rounded-lg bg-[#f6f8f5] border border-[#e2e7df] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                isOfficerOrAdmin
                  ? 'bg-rose-700 text-white'
                  : 'bg-[#126a50] text-white'
              }`}
            >
              {isOfficerOrAdmin ? <Shield size={13} /> : <User size={13} />}
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#1c2925] truncate">
                {isOfficerOrAdmin ? 'Nodal Officer Desk' : 'Citizen Portal'}
              </div>
              <div className="text-[10px] text-[#536157] truncate">
                {currentUser?.name || 'Citizen User'}
              </div>
            </div>
          </div>
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
              isOfficerOrAdmin
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isOfficerOrAdmin ? 'ADMIN' : 'CITIZEN'}
          </span>
        </div>

        {/* Section Heading */}
        <div className="px-2 pb-1.5 text-[10px] font-bold text-[#79827c] uppercase tracking-wider">
          {isOfficerOrAdmin ? 'Officer Operations' : 'Citizen Services'}
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {activeNavList.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? isOfficerOrAdmin
                      ? 'bg-[#1C2925] text-white'
                      : 'bg-[#126a50] text-white'
                    : 'text-[#34443a] hover:bg-[#f4f6f2]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#79827c]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : item.badgeColor || 'bg-[#fdf3f1] text-[#a45a4b] border-[#f5d6d0]'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-white/70' : 'text-[#a1a99f]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Showcase Role Switcher Button */}
      <div className="mt-4 pt-3 border-t border-[#e7e9e2] space-y-2">
        <button
          onClick={handleToggleDemoRole}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-[#f0f5f2] hover:bg-[#e4ede7] border border-[#d1ded6] text-[#126a50] text-xs font-bold transition-all cursor-pointer group shadow-2xs"
          title={
            isOfficerOrAdmin
              ? 'Switch to Citizen user view'
              : 'Switch to Nodal Officer / Admin view'
          }
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#126a50] group-hover:rotate-180 transition-transform" />
            <span className="text-[11px]">
              {isOfficerOrAdmin ? 'Switch to Citizen View' : 'Switch to Officer Desk'}
            </span>
          </div>
          <Sparkles className="w-3 h-3 text-amber-600" />
        </button>

        {/* Digital India AI Brand Footer */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center justify-between p-2 rounded-lg bg-[#f7f8f5] hover:bg-[#f0f3ee] border border-[#e7e9e2] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#126a50] text-white shrink-0 flex items-center justify-center text-[9px] font-bold">
              BS
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#1c2925] truncate">
                {t('brand_title')}
              </div>
              <div className="text-[9px] text-[#536157] truncate">
                {t('support_247')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-3 h-3 text-[#79827c] shrink-0" />
        </div>
      </div>
    </aside>
  );
};
