import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { SpeechService } from '../../services/speech';
import {
  ChatMessage,
  SupportCategory,
  SupportedLanguage
} from '../../types';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Globe,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Clock,
  UserCheck,
  AlertTriangle,
  BookOpen,
  FilePlus,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../data/i18n';

interface AIAssistantViewProps {
  initialQuery?: string;
  initialCategory?: SupportCategory;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onCreateTicketFromChat: (data: { title: string; description: string; category: SupportCategory }) => void;
  onEscalateToHuman: (data: { title: string; description: string; category: SupportCategory; reason: string }) => void;
  onNavigateView?: (view: string) => void;
}

const QUICK_CHIPS = [
  { label: 'Government Services', query: 'Tell me about PM-Kisan and DBT schemes' },
  { label: 'Scholarships', query: 'How to apply for National Scholarship Portal (NSP)?' },
  { label: 'Education', query: 'What free courses are available under Skill India PMKVY?' },
  { label: 'Health', query: 'How to download Ayushman Golden Card for 5 Lakh cashless health?' },
  { label: 'Other', query: 'How to update Aadhaar address online?' },
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialQuery,
  initialCategory,
  currentLanguage,
  onLanguageChange,
  onCreateTicketFromChat,
  onEscalateToHuman,
  onNavigateView,
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [conversationId] = useState<string>(`conv-${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const firstName = currentUser?.name?.split(' ')[0] || 'Citizen';
    const greetings: Record<SupportedLanguage, string> = {
      en: `Hello ${firstName}! I'm your Bharat Support AI assistant. How can I help you today?`,
      hi: `नमस्ते ${firstName}! मैं आपका भारत सपोर्ट एआई सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`,
      te: `నమస్కారం ${firstName}! నేను మీ భారత్ సపోర్ట్ AI సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?`,
      ta: `வணக்கம் ${firstName}! நான் உங்கள் பாரத் சப்போர்ட் AI உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
      bn: `নমস্কার ${firstName}! আমি আপনার ভারত সাপোর্ট এআই সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
      mr: `नमस्कार ${firstName}! मी तुमचा भारत सपोर्ट एआय सहाय्यक आहे. आज मी आपल्याला कशी मदत करू शकेन?`,
      gu: `નમસ્તે ${firstName}! હું તમારો ભારત સપોર્ટ AI સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?`,
      kn: `ನಮಸ್ಕಾರ ${firstName}! ನಾನು ನಿಮ್ಮ ಭಾರತ್ ಸಪೋರ್ಟ್ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
    };

    const welcomeMsg: ChatMessage = {
      id: 'msg-0',
      sender: 'ai',
      content: greetings[currentLanguage] || greetings.en,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);

    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [currentLanguage, currentUser]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.sendMessage({
        query: text,
        conversationId,
        language: currentLanguage,
      });

      setMessages((prev) => [...prev, res.aiMessage]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          content: 'I am ready to assist you with government schemes, certificates, or grievance escalation.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      const ok = SpeechService.initRecognition(
        (transcript) => {
          setInputValue(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        () => setIsListening(false),
        currentLanguage
      );
      if (ok) {
        SpeechService.startListening();
        setIsListening(true);
      }
    }
  };

  const t = (key: string) => getTranslation(currentLanguage, key);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
      {/* Main Chat Area (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[520px] bg-white rounded-2xl border border-bsai-border shadow-xs overflow-hidden">
        {/* Top Greeting Header */}
        <div className="p-4 border-b border-bsai-border bg-[#fbfcf9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-bsai-teal text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-bsai-indigo">{t('brand_title')}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="text-[11px] text-bsai-indigoMuted">
                {t('ai_subtext')}
              </div>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]/60">
          <div className="text-center py-2">
            <h2 className="text-base font-extrabold font-display text-bsai-indigo">
              {t('ai_greeting_prefix')} {currentUser?.name?.split(' ')[0] || 'Citizen'}?
            </h2>
            <p className="text-xs text-bsai-indigoMuted">
              {t('ai_subtext')}
            </p>
          </div>

          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 max-w-xl ${
                  isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                    isAi
                      ? 'bg-bsai-teal text-white'
                      : 'bg-[#47705a] text-white'
                  }`}
                >
                  {isAi ? 'AI' : (currentUser?.avatarInitials || 'U')}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white text-bsai-indigo border border-bsai-border shadow-xs'
                      : 'bg-bsai-teal text-white shadow-xs rounded-tr-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Active AI Source Badge */}
                  {isAi && m.sources && m.sources.length > 0 && m.id !== 'msg-0' && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                      <span className="font-medium text-[#126a50] bg-[#eaf2ec] border border-[#dce9de] px-1.5 py-0.5 rounded text-[9px]">
                        ⚡ {m.sources[0]}
                      </span>
                    </div>
                  )}

                  {/* Actions inside AI bubble */}
                  {isAi && m.id !== 'msg-0' && (
                    <div className="mt-3 pt-2.5 border-t border-bsai-border/80 flex items-center justify-between gap-2 text-[11px]">
                      <BSAIButton
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          onCreateTicketFromChat({
                            title: 'Inquiry via BSAI Chat',
                            description: m.content.slice(0, 200),
                            category: m.category || 'Government Services',
                          })
                        }
                        icon={<FilePlus className="w-3.5 h-3.5" />}
                        iconPosition="left"
                      >
                        {t('create_request_btn')}
                      </BSAIButton>

                      <BSAIButton
                        variant="escalate"
                        size="sm"
                        onClick={() =>
                          onEscalateToHuman({
                            title: 'Citizen Escalation Request',
                            description: m.content.slice(0, 200),
                            category: m.category || 'Government Services',
                            reason: 'User requested human officer intervention',
                          })
                        }
                        icon={<AlertTriangle className="w-3.5 h-3.5" />}
                        iconPosition="left"
                      >
                        {t('request_human_support')}
                      </BSAIButton>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-bsai-indigoMuted">
              <span className="w-2 h-2 rounded-full bg-bsai-teal animate-ping" />
              <span>BSAI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Category Chips */}
        <div className="px-4 py-2 bg-white border-t border-bsai-border/80 flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.query)}
              className="bg-bsai-pearl hover:bg-teal-50 hover:text-bsai-teal hover:border-teal-200 text-bsai-indigo font-semibold text-[11px] px-3 py-1.5 rounded-xl border border-bsai-border transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-bsai-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('ask_ai_placeholder')}
              className="flex-1 bg-bsai-pearl border border-bsai-border rounded-xl px-3.5 py-2.5 text-xs text-bsai-indigo placeholder-bsai-indigoMuted focus:outline-none focus:border-bsai-teal"
            />

            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-bsai-pearl text-bsai-indigo border-bsai-border hover:bg-bsai-border/70 hover:border-bsai-teal'
              }`}
              title={t('voice_input')}
            >
              <Mic className="w-4 h-4" />
            </button>

            <BSAIButton
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputValue.trim() || isLoading}
              icon={<Send className="w-4 h-4" />}
              iconPosition="right"
            >
              {t('send_btn')}
            </BSAIButton>
          </form>
        </div>
      </div>

      {/* Right Sidebar: Quick Actions & Study Intelligence & Recent Activity (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Study & Scholarship AI Tutor Card */}
        <div className="bg-[#f2f5ef] rounded-xl p-4 border border-[#e2e9e1] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                🎓
              </span>
              <div>
                <h4 className="text-xs font-bold text-bsai-indigo leading-tight">
                  {t('study_ai_title')}
                </h4>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  {t('study_ai_sub')}
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              AI Tutor
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => handleSend('How do I apply for National Scholarship Portal (NSP 2026-27)?')}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-left border border-emerald-100 shadow-2xs text-[11px] font-medium text-bsai-indigo hover:text-emerald-700 transition-colors"
            >
              <div className="font-bold text-[10px] text-emerald-800">📜 NSP Scholarships</div>
              <div className="text-[9px] text-bsai-indigoMuted">Eligibility & Documents</div>
            </button>

            <button
              onClick={() => handleSend('What free skill certifications are available under PMKVY 4.0?')}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-left border border-emerald-100 shadow-2xs text-[11px] font-medium text-bsai-indigo hover:text-emerald-700 transition-colors"
            >
              <div className="font-bold text-[10px] text-emerald-800">🚀 PMKVY 4.0 Skills</div>
              <div className="text-[9px] text-bsai-indigoMuted">AI & IT Certification</div>
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-bsai-border shadow-xs space-y-2.5">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-bsai-indigoMuted">
            {t('quick_actions')}
          </h3>

          <div className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => onNavigateView && onNavigateView('my-requests')}
              className="w-full text-left p-2 rounded-xl bg-bsai-pearl hover:bg-blue-50 text-bsai-indigo flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  📋
                </span>
                <div>
                  <div className="font-bold text-[11px]">{t('track_my_request')}</div>
                  <div className="text-[9px] text-bsai-indigoMuted">Check status of your query</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-bsai-indigoMuted group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() =>
                onCreateTicketFromChat({
                  title: 'New Citizen Request',
                  description: 'Citizen initiated new support inquiry.',
                  category: 'Government Services',
                })
              }
              className="w-full text-left p-2 rounded-xl bg-bsai-pearl hover:bg-emerald-50 text-bsai-indigo flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                  ➕
                </span>
                <div>
                  <div className="font-bold text-[11px]">{t('raise_new_request')}</div>
                  <div className="text-[9px] text-bsai-indigoMuted">Get help with a new issue</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-bsai-indigoMuted group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() =>
                onEscalateToHuman({
                  title: 'Immediate Human Escalation',
                  description: 'Citizen requested human desk support.',
                  category: 'Government Services',
                  reason: 'Direct citizen escalation',
                })
              }
              className="w-full text-left p-2 rounded-xl bg-bsai-pearl hover:bg-red-50 text-bsai-indigo flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs">
                  ⚠️
                </span>
                <div>
                  <div className="font-bold text-[11px]">{t('request_human_support')}</div>
                  <div className="text-[9px] text-bsai-indigoMuted">District nodal desk</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-bsai-indigoMuted group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateView && onNavigateView('knowledge-base')}
              className="w-full text-left p-2 rounded-xl bg-bsai-pearl hover:bg-purple-50 text-bsai-indigo flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                  📚
                </span>
                <div>
                  <div className="font-bold text-[11px]">{t('knowledge_base_link')}</div>
                  <div className="text-[9px] text-bsai-indigoMuted">Official schemes & guides</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-bsai-indigoMuted group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-bsai-border shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-bsai-indigoMuted">
              Recent Inquiries
            </h3>
            <button
              onClick={() => onNavigateView && onNavigateView('my-requests')}
              className="text-[10px] font-bold text-bsai-teal hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-bsai-indigo">Passport Application Nodal</div>
                <div className="text-[9px] text-bsai-indigoMuted">2 hours ago • Resolved</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1 shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-bsai-indigo">NSP Post-Matric Scholarship</div>
                <div className="text-[9px] text-bsai-indigoMuted">5 hours ago • Verified</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-bsai-indigo">Ration Card Transfer</div>
                <div className="text-[9px] text-bsai-indigoMuted">1 day ago • Open</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
