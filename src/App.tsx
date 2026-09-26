import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/views/LandingPage';
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

import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/common/AuthModal';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('bsai_language') as SupportedLanguage) || 'en';
  });

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

  // When ticket is created, celebrate and route to My Requests
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

  return (
    <div className="min-h-screen bg-transparent text-bsai-indigo flex flex-col selection:bg-bsai-saffron selection:text-bsai-indigo relative">
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
      ) : (
        <div className="flex-1 flex w-full min-h-[calc(100vh-65px)] relative px-2 sm:px-4 lg:px-6 py-2 sm:py-3 gap-3 sm:gap-4 lg:gap-5">
          {/* Light-themed Frosted Pearl Dashboard Sidebar */}
          <Sidebar
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
            currentLanguage={currentLanguage}
          />

          {/* Internal Dashboard Page Content */}
          <main className="workspace-view flex-1 w-full max-w-full overflow-x-hidden relative z-10">
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
