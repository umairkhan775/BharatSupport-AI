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
  Compass
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { api } from '../../services/api';
import { getTranslation } from '../../data/i18n';

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
  const [escalatedCount, setEscalatedCount] = useState(escalatedCountProp ?? 0);

  useEffect(() => {
    if (escalatedCountProp !== undefined) {
      setEscalatedCount(escalatedCountProp);
      return;
    }
    api.getAnalytics().then((summary) => setEscalatedCount(summary.escalatedQueries)).catch(() => setEscalatedCount(0));
  }, [escalatedCountProp]);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const navItems = [
    { id: 'landing', label: t('nav_landing'), icon: LayoutDashboard },
    { id: 'dashboard', label: t('nav_command_center'), icon: Compass },
    { id: 'ai-assistant', label: t('nav_ai_assistant'), icon: Bot },
    { id: 'my-requests', label: t('nav_my_requests'), icon: UserCheck },
    { id: 'support-requests', label: t('nav_support_requests'), icon: Inbox },
    { id: 'knowledge-base', label: t('nav_knowledge_base'), icon: BookOpen },
    { id: 'escalations', label: t('nav_escalations'), icon: AlertTriangle, badge: escalatedCount > 0 ? `${escalatedCount}` : null },
    { id: 'analytics', label: t('nav_analytics'), icon: BarChart3 },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <aside className="w-60 lg:w-64 bg-white border border-[#e7e9e2] rounded-xl p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-85px)] sticky top-[75px] z-20 overflow-y-auto">
      {/* Navigation Group */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#126a50] text-white'
                  : 'text-[#34443a] hover:bg-[#f4f6f2]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#79827c]'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#fdf3f1] text-[#a45a4b] border border-[#f5d6d0]'
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

      {/* Bottom Digital India AI Citizen Desk Badge */}
      <div
        onClick={() => onNavigate('dashboard')}
        className="mt-4 pt-3 border-t border-[#e7e9e2] cursor-pointer group"
      >
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f8f5] hover:bg-[#f0f3ee] border border-[#e7e9e2] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#126a50] text-white shrink-0 flex items-center justify-center text-[10px] font-bold">
              BS
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#1c2925] truncate">
                {t('brand_title')}
              </div>
              <div className="text-[10px] text-[#536157] truncate">
                {t('support_247')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#79827c] shrink-0" />
        </div>
      </div>
    </aside>
  );
};
