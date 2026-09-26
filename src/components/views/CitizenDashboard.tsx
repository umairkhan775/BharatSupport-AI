import React, { useEffect, useState } from 'react';
import {
  Bot,
  FilePlus2,
  ChevronRight,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Landmark,
  HeartPulse,
  GraduationCap,
  FileText,
  ShieldCheck,
  PhoneCall,
  Search,
  Sparkles,
  Inbox,
  User,
  Compass,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Ticket, SupportedLanguage, SupportCategory } from '../../types';
import { getTranslation } from '../../data/i18n';

interface CitizenDashboardProps {
  onNavigate: (view: string) => void;
  currentLanguage: SupportedLanguage;
  onSelectTicket?: (ticket: Ticket) => void;
  onNavigateToChatWithQuery?: (query: string, category: SupportCategory) => void;
  onOpenCreateTicket?: (category?: SupportCategory, title?: string, description?: string, isEscalated?: boolean) => void;
}

const relativeTime = (value: string) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} hr ago`;
};

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigate,
  currentLanguage,
  onSelectTicket,
  onNavigateToChatWithQuery,
  onOpenCreateTicket
}) => {
  const { currentUser, switchUser, allUsers } = useAuth();
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getTickets().then((tickets) => {
      if (currentUser) {
        const filtered = tickets.filter(
          (t) =>
            (t.userId && t.userId === currentUser.id) ||
            (t.citizenName &&
              t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
            (t.citizenEmail && t.citizenEmail.toLowerCase() === currentUser.email.toLowerCase())
        );
        setMyTickets(filtered);
      } else {
        setMyTickets(tickets.slice(0, 2));
      }
    }).catch((err) => console.error('Error fetching citizen tickets:', err))
    .finally(() => setIsLoading(false));
  }, [currentUser]);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const activeTickets = myTickets.filter((t) => t.status !== 'Resolved');
  const resolvedTickets = myTickets.filter((t) => t.status === 'Resolved');

  const POPULAR_SCHEMES = [
    {
      category: 'Government Services' as SupportCategory,
      title: 'PM-Kisan Samman Nidhi',
      benefit: '₹6,000 / year via DBT',
      status: 'Aadhaar Seeded Active',
      icon: Landmark,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      query: 'Check my PM-Kisan 18th installment disbursement status and land seeding.'
    },
    {
      category: 'Healthcare' as SupportCategory,
      title: 'Ayushman Bharat (PM-JAY)',
      benefit: '₹5 Lakh Annual Cashless Cover',
      status: 'e-KYC Verified',
      icon: HeartPulse,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      query: 'How to generate and download my Ayushman Golden Card for hospital treatment?'
    },
    {
      category: 'Education' as SupportCategory,
      title: 'National Scholarship Portal (NSP)',
      benefit: 'Pre & Post-Matric Scholarships',
      status: 'Verification Queue',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      query: 'What is the procedure for National Scholarship Portal OTR registration and biometric auth?'
    },
    {
      category: 'Documents & Identity' as SupportCategory,
      title: 'DigiLocker Paperless Vault',
      benefit: 'Original Document Parity',
      status: 'Linked to Aadhaar',
      icon: FileText,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      query: 'How to pull verified Driving License and Class 10/12 Marksheet into DigiLocker?'
    }
  ];

  const QUICK_PROMPTS = [
    { label: 'Check PM-Kisan Installment', query: 'Check status of my PM-Kisan installment and NPCI bank seeding.', category: 'Government Services' as SupportCategory },
    { label: 'Download Ayushman Card', query: 'How can I download my Ayushman Golden Card using Aadhaar OTP?', category: 'Healthcare' as SupportCategory },
    { label: 'Track Scholarship Verification', query: 'My NSP scholarship application is pending at institute desk. How to expedite?', category: 'Education' as SupportCategory },
    { label: 'Ration / PDS Quota Issue', query: 'Ration dealer denied subsidized quota under NFSA. How to lodge an official complaint?', category: 'Government Services' as SupportCategory }
  ];

  const handleSwitchToOfficer = () => {
    const officer =
      allUsers.find((u) => u.role === 'Nodal Officer') ||
      allUsers.find((u) => u.role === 'Support Admin') ||
      allUsers[3];
    if (officer) {
      switchUser(officer.id);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* 1. Citizen Welcome Header Card */}
      <div className="bg-gradient-to-r from-[#126A50] via-[#177a5d] to-[#0c4b38] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 text-[#cbe3d7]">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Digital India Citizen Portal • {currentUser?.state || 'India'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Namaste, {currentUser?.name?.split(' ')[0] || 'Citizen'}!
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Your unified citizen window for government welfare schemes, direct benefit transfers (DBT), DigiLocker verified certificates, and public grievance resolution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#126a50] hover:bg-[#edf6f2] text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Bot size={16} />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={() => onOpenCreateTicket?.()}
              className="px-4 py-2.5 rounded-xl bg-[#c25e00] hover:bg-[#a85200] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FilePlus2 size={16} />
              <span>Raise Request / Grievance</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Summary Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-white/70 uppercase font-bold">Active Cases</div>
            <div className="text-xl font-black text-white mt-0.5">{activeTickets.length} Pending</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-white/70 uppercase font-bold">Resolved Requests</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{resolvedTickets.length} Completed</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-white/70 uppercase font-bold">Preferred Language</div>
            <div className="text-xl font-black text-amber-300 mt-0.5 uppercase">{currentLanguage}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-white/70 uppercase font-bold">Support Channel</div>
            <div className="text-xl font-black text-white mt-0.5">24/7 AI Desk</div>
          </div>
        </div>
      </div>

      {/* 2. My Active Requests & Grievance Tracker */}
      <div className="bg-white rounded-3xl p-6 border border-[#d8ded5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e9e2]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#126a50] flex items-center justify-center font-bold">
              <Inbox size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold font-display text-[#1c2925]">
                My Service Requests & Grievances
              </h2>
              <p className="text-xs text-[#536157]">
                Track the status of your inquiries, applications, and nodal officer escalations
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('my-requests')}
            className="text-xs font-bold text-[#126a50] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All My Requests ({myTickets.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {myTickets.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#f4f7f4] text-[#126a50] flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-xs font-bold text-[#1c2925]">No Active Requests</div>
            <p className="text-xs text-[#79827c] max-w-sm mx-auto">
              You do not have any pending inquiries. Ask our AI Assistant or raise an inquiry regarding government benefits anytime.
            </p>
            <button
              onClick={() => onOpenCreateTicket?.()}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#126a50] text-white text-xs font-bold cursor-pointer"
            >
              Raise an Inquiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myTickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  onSelectTicket?.(ticket);
                  onNavigate('my-requests');
                }}
                className="p-4 rounded-2xl border border-[#d8ded5] hover:border-[#126a50] bg-[#fafbf9] hover:bg-white transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#126a50]">
                    {ticket.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.status === 'Escalated'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#1c2925] line-clamp-1 group-hover:text-[#126a50] transition-colors">
                  {ticket.title}
                </h3>
                <p className="text-[11px] text-[#536157] line-clamp-2 mt-1">
                  {ticket.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#e7e9e2] flex items-center justify-between text-[10px] text-[#79827c]">
                  <span>{ticket.category}</span>
                  <span className="font-semibold text-[#126a50] flex items-center gap-1">
                    <span>Track Status</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Popular Welfare Schemes & Direct Verification */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-[#1c2925]">
              National Citizen Schemes & Direct Verification
            </h2>
            <p className="text-xs text-[#536157]">
              Check eligibility, requirements, and official portals for major Digital India initiatives
            </p>
          </div>
          <button
            onClick={() => onNavigate('knowledge-base')}
            className="text-xs font-bold text-[#126a50] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Schemes</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_SCHEMES.map((scheme, idx) => {
            const Icon = scheme.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#d8ded5] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-[#f0f6f2] text-[#126a50] flex items-center justify-center font-bold">
                      <Icon size={20} />
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${scheme.color}`}>
                      {scheme.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1c2925] group-hover:text-[#126a50] transition-colors leading-snug">
                    {scheme.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#126a50] mt-1">
                    {scheme.benefit}
                  </div>
                  <div className="text-[10px] text-[#79827c] mt-0.5">
                    Category: {scheme.category}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToChatWithQuery?.(scheme.query, scheme.category)}
                  className="mt-4 w-full py-2 rounded-xl bg-[#f4f7f4] hover:bg-[#126a50] hover:text-white text-[#126a50] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Bot size={13} />
                  <span>Verify with AI</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Assistant Prompts & Helplines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Question Prompts (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#d8ded5] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c25e00]" />
            <h3 className="text-sm font-bold text-[#1c2925]">
              Quick Assistance Topics (1-Click Ask)
            </h3>
          </div>
          <p className="text-xs text-[#536157]">
            Select any question to consult our multi-lingual citizen AI engine immediately:
          </p>

          <div className="space-y-2 pt-1">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => onNavigateToChatWithQuery?.(p.query, p.category)}
                className="w-full text-left p-3 rounded-xl bg-[#f8faf7] hover:bg-[#edf5f0] border border-[#e2e8df] hover:border-[#126a50] transition-all flex items-center justify-between gap-3 text-xs font-bold text-[#1c2925] cursor-pointer group"
              >
                <span>{p.label}</span>
                <ArrowRight size={13} className="text-[#126a50] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Helplines & Authority Directory (5 cols) */}
        <div className="lg:col-span-5 bg-[#fbfcf9] rounded-3xl p-6 border border-[#d8ded5] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall className="w-4 h-4 text-[#126a50]" />
              <h3 className="text-sm font-bold text-[#1c2925]">
                National Toll-Free Helplines
              </h3>
            </div>
            <p className="text-xs text-[#536157]">
              Official 24/7 central support helplines for Indian citizens:
            </p>

            <div className="space-y-2 mt-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8df] flex items-center justify-between">
                <span className="font-semibold text-[#1c2925]">National Citizen Portal</span>
                <span className="font-mono font-bold text-[#126a50]">1800-11-0031</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8df] flex items-center justify-between">
                <span className="font-semibold text-[#1c2925]">Ayushman Bharat (Health)</span>
                <span className="font-mono font-bold text-[#126a50]">14555</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8df] flex items-center justify-between">
                <span className="font-semibold text-[#1c2925]">PM-Kisan Kisan Call Centre</span>
                <span className="font-mono font-bold text-[#126a50]">155261</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8df] flex items-center justify-between">
                <span className="font-semibold text-[#1c2925]">PDS Ration / Food Security</span>
                <span className="font-mono font-bold text-[#126a50]">1967</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8df] flex items-center justify-between">
                <span className="font-semibold text-[#1c2925]">DARPG Public Grievances</span>
                <span className="font-mono font-bold text-[#126a50]">1915</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switch Note */}
          <div className="pt-3 border-t border-[#e7e9e2] flex items-center justify-between">
            <span className="text-[11px] text-[#79827c]">Showcasing as Officer?</span>
            <button
              onClick={handleSwitchToOfficer}
              className="text-xs font-bold text-rose-800 hover:underline cursor-pointer"
            >
              Switch to Nodal Desk →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
