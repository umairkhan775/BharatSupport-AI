import React, { FormEvent, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  MessageCircle,
  Scale,
  Search,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Volume2,
  Building2,
  Users,
  Compass,
  FileCheck,
  Activity,
  ExternalLink
} from 'lucide-react';
import { SupportCategory, SupportedLanguage } from '../../types';
import { getTranslation } from '../../data/i18n';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onNavigateToChatWithQuery: (query: string, category: SupportCategory) => void;
  onNavigateToCreateTicket: (category: SupportCategory) => void;
  currentLanguage: SupportedLanguage;
}

const services = [
  {
    category: 'Government Services' as SupportCategory,
    title: 'Welfare Schemes & DBT',
    hindi: 'सरकारी योजनाएँ एवं डीबीटी',
    description: 'Direct Benefit Transfer, PM-Kisan installments, ration cards, and social pensions.',
    icon: Landmark,
    query: 'Tell me about PM-Kisan land seeding and DBT bank account mapping.',
  },
  {
    category: 'Education' as SupportCategory,
    title: 'Scholarships & Higher Education',
    hindi: 'छात्रवृत्ति एवं कौशल विकास',
    description: 'National Scholarship Portal (NSP 2026), One-Time Registration (OTR), and PMKVY.',
    icon: GraduationCap,
    query: 'How do I apply for National Scholarship Portal (NSP) with OTR registration?',
  },
  {
    category: 'Healthcare' as SupportCategory,
    title: 'Health & Cashless Treatment',
    hindi: 'आयुष्मान भारत स्वास्थ्य सेवाएँ',
    description: 'Ayushman Golden Card (₹5 Lakh), hospital empanelment, and Senior 70+ cards.',
    icon: HeartPulse,
    query: 'How to download Ayushman Golden Card and find cashless empanelled hospitals?',
  },
  {
    category: 'Documents & Identity' as SupportCategory,
    title: 'Aadhaar, PAN & DigiLocker',
    hindi: 'पहचान पत्र एवं दस्तावेज़',
    description: 'Aadhaar address update, PVC cards, driving license, and DigiLocker certificates.',
    icon: FileText,
    query: 'How to update Aadhaar address online and link documents to DigiLocker?',
  },
  {
    category: 'Employment' as SupportCategory,
    title: 'MSME, Mudra & Livelihoods',
    hindi: 'उद्यम पंजीकरण एवं मुद्रा ऋण',
    description: 'Free Udyam MSME certification, PM Mudra loans (up to ₹20L), and PM-SVANidhi.',
    icon: BriefcaseBusiness,
    query: 'How to apply for free Udyam MSME registration and PM Mudra loan?',
  },
  {
    category: 'Grievance Redressal' as SupportCategory,
    title: 'CPGRAMS Public Grievances',
    hindi: 'लोक शिकायत निवारण (CPGRAMS)',
    description: 'Formal central and state grievance filing with guaranteed 21-day departmental SLA.',
    icon: Scale,
    query: 'How can I lodge an official complaint on CPGRAMS portal for unresolved delays?',
  },
];

const steps = [
  {
    number: '01',
    title: 'Tell us what you need in plain language',
    description: 'Start with an issue, a scheme name, or an error message. Speak or type in Hindi, Tamil, Telugu, Bengali, Marathi, or English.',
  },
  {
    number: '02',
    title: 'Get instant official procedures & eligibility',
    description: 'BSAI references authentic government gazettes, portal links, and required documentation to map your immediate next step.',
  },
  {
    number: '03',
    title: 'Escalate to District Nodal Officers when needed',
    description: 'If your application is stuck or disputed, BSAI generates an official tracking token and routes your case for human review.',
  },
];

const SCHEME_PROFILES = [
  {
    id: 'farmer',
    label: 'Farmer / Agriculture',
    schemes: [
      { name: 'PM-Kisan Samman Nidhi', benefit: '₹6,000 / year via DBT', req: 'Aadhaar e-KYC & Land Record Seeding' },
      { name: 'PM Fasal Bima Yojana', benefit: 'Comprehensive Crop Insurance', req: 'Sowing Certificate & Bank Passbook' },
      { name: 'Kisan Credit Card (KCC)', benefit: 'Subsidized loan up to ₹3 Lakh', req: 'Land Revenue Record (Khasra/Khatauni)' },
    ],
  },
  {
    id: 'student',
    label: 'Student / Scholarships',
    schemes: [
      { name: 'National Scholarship Portal (NSP)', benefit: 'Full tuition & maintenance allowance', req: 'OTR, Bonafide & Income Certificate' },
      { name: 'Skill India PMKVY 4.0', benefit: 'Free IT/AI Certification + Stipend', req: 'Class 10/12 Marksheet & Aadhaar' },
      { name: 'PM-YASASVI Merit Award', benefit: '₹75,000 - ₹1,25,000 per year', req: 'OBC/EBC/DNT Category Certificate' },
    ],
  },
  {
    id: 'senior',
    label: 'Senior Citizen (70+)',
    schemes: [
      { name: 'Ayushman Vaya Vandana Card', benefit: '₹5 Lakh free treatment (No income bar)', req: 'Aadhaar (Age 70+) & Live Photo e-KYC' },
      { name: 'National Social Assistance (IGNOAPS)', benefit: 'Monthly Old Age Pension', req: 'BPL Card / Income Certificate' },
    ],
  },
  {
    id: 'msme',
    label: 'MSME & Entrepreneur',
    schemes: [
      { name: 'Udyam Registration', benefit: 'Priority Sector Lending & Subsidies', req: 'Aadhaar & PAN Number (Zero Fee)' },
      { name: 'PM Mudra Yojana (Shishu/Kishore/Tarun)', benefit: 'Collateral-free loan up to ₹20 Lakh', req: 'Udyam Certificate & Project Report' },
      { name: 'PM-SVANidhi', benefit: 'Collateral-free working capital loan', req: 'Urban Vending Certificate / LOR' },
    ],
  },
];

const PORTAL_HEALTH = [
  { name: 'UIDAI / Aadhaar e-KYC', status: 'Optimal', latency: '120ms', uptime: '99.98%' },
  { name: 'DigiLocker IT Rules 9A', status: 'Optimal', latency: '95ms', uptime: '99.95%' },
  { name: 'PM-Kisan DBT Clearing', status: 'Operational', latency: '180ms', uptime: '99.90%' },
  { name: 'NHA Ayushman Network', status: 'Operational', latency: '140ms', uptime: '99.92%' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onNavigateToChatWithQuery,
  onNavigateToCreateTicket,
  currentLanguage,
}) => {
  const [question, setQuestion] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('farmer');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim()) {
      onNavigateToChatWithQuery(question.trim(), 'Government Services');
    }
  };

  const activeProfile = SCHEME_PROFILES.find((p) => p.id === selectedProfileId) || SCHEME_PROFILES[0];

  return (
    <main className="civic-home">
      {/* 1. Hero Section with Mascot Logo */}
      <section className="civic-hero">
        <div className="civic-hero-copy">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/bsai-logo.jpg"
              alt="Bharat Support AI Mascot Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white border border-[#e7e9e2] p-0.5 shadow-sm"
            />
            <div className="civic-kicker">
              <span className="civic-kicker-rule" /> DIGITAL INDIA CITIZEN DESK
            </div>
          </div>

          <h1>
            Public services,<br />
            <span>made easier to reach.</span>
          </h1>

          <p>
            Get clear, verified guidance for central and state citizen schemes—in the language you’re comfortable using.
            Powered by authoritative data, natural speech, and direct nodal officer escalation.
          </p>

          <div className="civic-proof-points">
            <span>
              <ShieldCheck size={15} /> 150+ Official Schemes
            </span>
            <span>
              <AudioLines size={15} /> 8 Indian Languages
            </span>
            <span>
              <Headphones size={15} /> District Nodal Escalation
            </span>
          </div>

          <div className="flex items-center gap-4 mt-7">
            <button className="civic-secondary-link" onClick={onEnterDashboard}>
              Open Command Center <ArrowUpRight size={16} />
            </button>
            <button
              onClick={() => onNavigateToChatWithQuery('Tell me about citizen services', 'Government Services')}
              className="inline-flex items-center gap-2 bg-[#126a50] hover:bg-[#0d503d] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle size={14} /> Start Citizen Chat
            </button>
          </div>
        </div>

        {/* Hero Interactive Ask Box */}
        <div className="civic-ask-panel">
          <div className="civic-panel-topline">
            <span>CITIZEN DESK</span>
            <span className="civic-panel-index">24/7 LIVE</span>
          </div>
          <div className="civic-panel-icon">
            <MessageCircle size={18} />
          </div>
          <h2>What can we help you with?</h2>
          <p>Describe your issue or application question. We’ll provide official steps.</p>

          <form className="civic-question-form" onSubmit={submitQuestion}>
            <label className="sr-only" htmlFor="citizen-question">
              Ask a service question
            </label>
            <Search size={17} aria-hidden="true" />
            <input
              id="citizen-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. Check PM-Kisan status, Ayushman card photo error..."
            />
            <button type="submit" aria-label="Ask BSAI" disabled={!question.trim()}>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="civic-prompt-label">POPULAR CITIZEN INQUIRIES</div>
          <div className="civic-prompt-list">
            {[
              {
                label: 'Check PM-Kisan Land Seeding & e-KYC',
                query: 'How do I check my PM-Kisan land seeding and e-KYC status?',
                category: 'Government Services' as SupportCategory,
              },
              {
                label: 'Download Ayushman 5 Lakh Health Card',
                query: 'How to download Ayushman Golden Card for free hospital treatment?',
                category: 'Healthcare' as SupportCategory,
              },
              {
                label: 'Apply for NSP 2026 Scholarship with OTR',
                query: 'What is the step-by-step process for National Scholarship Portal OTR registration?',
                category: 'Education' as SupportCategory,
              },
            ].map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => onNavigateToChatWithQuery(prompt.query, prompt.category)}
              >
                <span>{prompt.label}</span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </div>
        <div className="civic-hero-index" aria-hidden="true">
          BHARAT / 01
        </div>
      </section>

      {/* 2. Interactive Citizen Entitlement & Scheme Matcher */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 border-t border-[#e7e9e2]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="civic-kicker">
              <span className="civic-kicker-rule" /> SCHEME MATCHING ENGINE
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c2925] mt-2">
              Find schemes and benefits tailored for you.
            </h2>
            <p className="text-xs text-[#536157] mt-1 max-w-xl">
              Select your citizen profile to see official entitlements, required documents, and instant application steps.
            </p>
          </div>

          <div className="flex gap-1.5 p-1 bg-[#f0f3ee] rounded-lg border border-[#e7e9e2] overflow-x-auto">
            {SCHEME_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedProfileId === p.id
                    ? 'bg-white text-[#126a50] shadow-xs font-bold'
                    : 'text-[#536157] hover:text-[#1c2925]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Entitlement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeProfile.schemes.map((scheme, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-[#e7e9e2] flex flex-col justify-between hover:border-[#126a50] transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#126a50] bg-[#eaf2ec] px-2 py-0.5 rounded-sm">
                    Verified Scheme
                  </span>
                  <span className="text-[11px] font-bold text-[#a87131]">
                    {scheme.benefit}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#1c2925] group-hover:text-[#126a50] transition-colors mb-2">
                  {scheme.name}
                </h3>
                <div className="text-[11px] text-[#536157] space-y-1">
                  <div className="font-semibold text-[#1c2925]">Required documents:</div>
                  <div>{scheme.req}</div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f0f2ed] flex items-center justify-between">
                <button
                  onClick={() =>
                    onNavigateToChatWithQuery(
                      `How do I apply for ${scheme.name}? What are the exact eligibility criteria and steps?`,
                      'Government Services'
                    )
                  }
                  className="text-xs font-bold text-[#126a50] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ask Eligibility & Steps</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Civic Services Directory */}
      <section id="services" className="civic-services">
        <div className="civic-section-heading">
          <div>
            <div className="civic-kicker">
              <span className="civic-kicker-rule" /> FIND THE RIGHT DESK
            </div>
            <h2>
              Support for the things<br />
              that matter day to day.
            </h2>
          </div>
          <p>
            Start with a service area. BSAI explains verified official procedures and guides you directly toward the right next step.
          </p>
        </div>

        <div className="civic-service-grid">
          {services.map(({ category, title, hindi, description, icon: Icon, query }, index) => (
            <button
              className="civic-service-card cursor-pointer"
              key={category}
              onClick={() => onNavigateToChatWithQuery(query, category)}
            >
              <div className="civic-service-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Icon size={18} strokeWidth={1.7} />
              </div>
              <h3>{title}</h3>
              <div className="civic-service-hindi">{hindi}</div>
              <p>{description}</p>
              <span className="civic-card-action">
                Explore this service <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>

        <div className="civic-all-services">
          <span>Can’t find your service or need custom assistance?</span>
          <button onClick={() => onNavigateToCreateTicket('Other Citizen Services')}>
            Submit an official support request <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 4. Live National Public Services Status & Health Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 border-t border-[#e7e9e2]">
        <div className="bg-white p-6 rounded-xl border border-[#e7e9e2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#e7e9e2]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#126a50]" />
              <h3 className="font-serif text-base font-bold text-[#1c2925]">
                National Citizen Infrastructure Connectivity
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#536157]">
              <span className="w-2 h-2 rounded-full bg-[#126a50] animate-pulse" />
              <span>All Systems Operational (99.9% Uptime)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PORTAL_HEALTH.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-[#fbfcf9] rounded-lg border border-[#e7e9e2]">
                <div className="text-xs font-bold text-[#1c2925] truncate">{p.name}</div>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-[#126a50] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#126a50]" />
                    {p.status}
                  </span>
                  <span className="text-[#79827c] font-mono">{p.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 3-Step Civic Process */}
      <section id="how-it-works" className="civic-how">
        <div className="civic-how-heading">
          <div className="civic-kicker civic-kicker-light">
            <span className="civic-kicker-rule" /> A SIMPLE WAY FORWARD
          </div>
          <h2>
            From question<br />
            to next step.
          </h2>
          <p>
            Support should feel straightforward and transparent. Here’s how BSAI helps you resolve public inquiries.
          </p>
          <button onClick={onEnterDashboard}>
            See the operations view <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="civic-steps">
          {steps.map((step) => (
            <article className="civic-step" key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <ArrowRight size={16} />
            </article>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="civic-footer">
        <div className="civic-footer-brand">
          <img
            src="/bsai-logo.jpg"
            alt="Bharat Support AI Mascot Logo"
            className="w-8 h-8 rounded-md object-contain bg-white border border-[#e7e9e2] p-0.5"
          />
          <span>
            <strong>Bharat Support AI</strong>
            <small>AI-Powered Customer Support for a Digital India</small>
          </span>
        </div>
        <div className="civic-footer-languages">
          English · हिन्दी · தமிழ் · తెలుగు · বাংলা · मराठी · ગુજરાતી · ಕನ್ನಡ
        </div>
        <button onClick={onEnterDashboard}>
          Open Command Center <ArrowUpRight size={14} />
        </button>
      </footer>
    </main>
  );
};
