import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/views/LandingPage';
import { LoginPage } from './components/views/LoginPage';
import { DashboardHome } from './components/views/DashboardHome';
import { AIAssistantView } from './components/views/AIAssistantView';
import { MyRequestsView } from './components/views/MyRequestsView';
import { SupportRequestsView } from './components/views/SupportRequestsView';
import { KnowledgeBaseView } from './components/views/KnowledgeBaseView';
import { EscalationsView } from './components/views/EscalationsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { CreateTicketModal } from './components/common/CreateTicketModal';
import { SupportedLanguage, SupportCategory, Ticket } from './types';
import { api } from './services/api';
import { ShieldAlert, ArrowLeftRight, ArrowLeft } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/common/AuthModal';

const AppContent: React.FC = () => {
  const { currentUser, switchUser, allUsers } = useAuth();
  const [activeView, setActiveView] = useState<string>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('bsai_language') as SupportedLanguage) || 'en';
  });

  const isOfficerOrAdmin =
    currentUser?.role === 'Nodal Officer' || currentUser?.role === 'Support Admin';

  // Load server settings on startup
  React.useEffect(() => {
    api.getSettings().then((settings) => {
      const stored = localStorage.getItem('bsai_language') as SupportedLanguage;
      if (!stored && settings.defaultLanguage) {
        setCurrentLanguage(settings.defaultLanguage);
      }
    }).catch(() => {});
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('bsai_language', lang);
    api.saveSettings({ defaultLanguage: lang }).catch(() => {});
  };

  // Modal State for New Ticket Creation
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [modalInitialCategory, setModalInitialCategory] = useState<SupportCategory>('Government Services');
  const [modalInitialTitle, setModalInitialTitle] = useState('');
  const [modalInitialDescription, setModalInitialDescription] = useState('');
  const [modalInitialIsEscalated, setModalInitialIsEscalated] = useState(false);

  // Cross-view state
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [chatInitialCategory, setChatInitialCategory] = useState<SupportCategory | undefined>(undefined);
  const [selectedTicketIdForView, setSelectedTicketIdForView] = useState<string | undefined>(undefined);

  // Navigate to AI Assistant with query prefilled
  const handleNavigateToChatWithQuery = (query: string, category: SupportCategory) => {
    setChatInitialQuery(query);
    setChatInitialCategory(category);
    setActiveView('ai-assistant');
  };

  // Open ticket modal with prefilled data
  const handleOpenCreateTicket = (
    category: SupportCategory = 'Government Services',
    title = '',
    description = '',
    isEscalated = false
  ) => {
    setModalInitialCategory(category);
    setModalInitialTitle(title);
    setModalInitialDescription(description);
    setModalInitialIsEscalated(isEscalated);
    setIsTicketModalOpen(true);
  };

  // When ticket is created, route to My Requests
  const handleTicketCreated = (ticket: Ticket) => {
    setSelectedTicketIdForView(ticket.id);
    setActiveView('my-requests');
  };

  // Reset demo data trigger
  const handleResetDemo = async () => {
    if (window.confirm('Reset BSAI demo database back to clean baseline state?')) {
      try {
        await api.resetDemoData();
        window.location.reload();
      } catch (e) {
        console.error('Reset failed:', e);
      }
    }
  };

  const handleSwitchToOfficer = () => {
    const officer =
      allUsers.find((u) => u.role === 'Nodal Officer') ||
      allUsers.find((u) => u.role === 'Support Admin') ||
      allUsers[3];
    if (officer) {
      switchUser(officer.id);
    }
  };

  // Check if current view is an officer/admin only view accessed by a citizen
  const isRestrictedForCitizen =
    !isOfficerOrAdmin &&
    ['escalations', 'support-requests', 'analytics', 'settings'].includes(activeView);

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#1c2925] flex flex-col selection:bg-[#c25e00]/20 selection:text-[#1c2925] relative">
      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onQuickSearch={(query) => {
          setChatInitialQuery(query);
          setActiveView('ai-assistant');
        }}
        onResetDemo={handleResetDemo}
      />

      {/* Main View Router */}
      {activeView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            currentLanguage={currentLanguage}
            onEnterDashboard={() => setActiveView('dashboard')}
            onNavigateToChatWithQuery={handleNavigateToChatWithQuery}
            onNavigateToCreateTicket={(cat) => handleOpenCreateTicket(cat)}
          />
        </main>
      ) : activeView === 'login' ? (
        <main className="flex-1">
          <LoginPage
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onNavigate={(view) => setActiveView(view)}
          />
        </main>
      ) : (
        <div className="flex-1 flex w-full min-h-[calc(100vh-65px)] relative px-2 sm:px-4 lg:px-6 py-2 sm:py-3 gap-3 sm:gap-4 lg:gap-5">
          {/* Dashboard Sidebar */}
          <Sidebar
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
            currentLanguage={currentLanguage}
          />

          {/* Internal Dashboard Page Content */}
          <main className="workspace-view flex-1 w-full max-w-full overflow-x-hidden relative z-10">
            {isRestrictedForCitizen ? (
              /* Role Restriction Guard Screen */
              <div className="bg-white rounded-2xl border border-[#d8ded5] p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldAlert size={28} />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Official Nodal Desk Restricted
                  </div>
                  <h2 className="text-xl font-bold font-display text-[#1c2925]">
                    Officer Access Required
                  </h2>
                  <p className="text-xs text-[#536157] mt-2 leading-relaxed">
                    You are currently signed in as <strong className="text-[#1c2925]">{currentUser?.name} (Citizen)</strong>.
                    District escalations queue, all citizen tickets inbox, and AI configuration settings are restricted to verified Government Nodal Officers and Administrators.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleSwitchToOfficer}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight size={14} />
                    <span>Switch to Nodal Officer (Amit Patel)</span>
                  </button>

                  <button
                    onClick={() => setActiveView('my-requests')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#f4f6f2] hover:bg-[#e4ede7] border border-[#d8ded5] text-[#1c2925] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Go to My Citizen Requests</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeView === 'dashboard' && (
                  <DashboardHome
                    onNavigate={(v) => setActiveView(v)}
                    currentLanguage={currentLanguage}
                    onSelectTicket={(t) => {
                      setSelectedTicketIdForView(t.id);
                      setActiveView('my-requests');
                    }}
                    onNavigateToChatWithQuery={handleNavigateToChatWithQuery}
                    onOpenCreateTicket={(cat, title, desc, esc) => handleOpenCreateTicket(cat, title, desc, esc)}
                  />
                )}

                {activeView === 'ai-assistant' && (
                  <AIAssistantView
                    initialQuery={chatInitialQuery}
                    initialCategory={chatInitialCategory}
                    currentLanguage={currentLanguage}
                    onLanguageChange={(lang) => setCurrentLanguage(lang)}
                    onCreateTicketFromChat={({ title, description, category }) =>
                      handleOpenCreateTicket(category, title, description, false)
                    }
                    onEscalateToHuman={({ title, description, category, reason }) =>
                      handleOpenCreateTicket(category, title, description, true)
                    }
                    onNavigateView={(v) => setActiveView(v)}
                  />
                )}

                {activeView === 'my-requests' && (
                  <MyRequestsView
                    currentLanguage={currentLanguage}
                    selectedTicketId={selectedTicketIdForView}
                    onCreateNewRequest={() => handleOpenCreateTicket()}
                  />
                )}

                {activeView === 'support-requests' && (
                  <SupportRequestsView
                    currentLanguage={currentLanguage}
                    onCreateNewRequest={() => handleOpenCreateTicket()}
                  />
                )}

                {activeView === 'knowledge-base' && (
                  <KnowledgeBaseView
                    currentLanguage={currentLanguage}
                    onAskAIAboutArticle={(topic, cat) =>
                      handleNavigateToChatWithQuery(`Tell me about ${topic}`, cat)
                    }
                  />
                )}

                {activeView === 'escalations' && (
                  <EscalationsView
                    currentLanguage={currentLanguage}
                    onSelectTicket={(tId) => {
                      setSelectedTicketIdForView(tId);
                      setActiveView('my-requests');
                    }}
                  />
                )}

                {activeView === 'analytics' && (
                  <AnalyticsView currentLanguage={currentLanguage} />
                )}

                {activeView === 'settings' && (
                  <SettingsView
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    onResetDemo={handleResetDemo}
                  />
                )}
              </>
            )}
          </main>
        </div>
      )}

      {/* Global Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onTicketCreated={handleTicketCreated}
        initialCategory={modalInitialCategory}
        initialTitle={modalInitialTitle}
        initialDescription={modalInitialDescription}
        initialIsEscalated={modalInitialIsEscalated}
        currentLanguage={currentLanguage}
      />

      {/* Global Authentication / Sign In Modal */}
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
