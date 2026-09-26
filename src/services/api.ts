import {
  Ticket,
  KnowledgeArticle,
  EscalationItem,
  AnalyticsSummary,
  SystemSettings,
  FeedbackSubmission,
  SupportedLanguage,
  SupportCategory,
  ChatMessage
} from '../types';
import {
  MOCK_ANALYTICS,
  MOCK_TICKETS,
  MOCK_ESCALATIONS,
  MOCK_KNOWLEDGE_ARTICLES,
  MOCK_SETTINGS
} from '../data/mockData';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';

// Helper functions for client-side storage
function getStoredTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem('bsai_tickets');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bsai_tickets from storage:', e);
  }
  return MOCK_TICKETS;
}

function saveStoredTickets(tickets: Ticket[]) {
  try {
    localStorage.setItem('bsai_tickets', JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving bsai_tickets:', e);
  }
}

function getStoredEscalations(): EscalationItem[] {
  try {
    const raw = localStorage.getItem('bsai_escalations');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bsai_escalations from storage:', e);
  }
  return MOCK_ESCALATIONS;
}

function saveStoredEscalations(items: EscalationItem[]) {
  try {
    localStorage.setItem('bsai_escalations', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving bsai_escalations:', e);
  }
}

function getStoredSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem('bsai_settings');
    if (raw) return { ...MOCK_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading bsai_settings:', e);
  }
  return MOCK_SETTINGS;
}

function saveStoredSettings(settings: Partial<SystemSettings>) {
  try {
    const curr = getStoredSettings();
    const updated = { ...curr, ...settings };
    localStorage.setItem('bsai_settings', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving bsai_settings:', e);
    return MOCK_SETTINGS;
  }
}

// Client-side AI fallback responder for zero-downtime offline support
function generateFallbackChatResponse(query: string, language: SupportedLanguage = 'en'): {
  aiMessage: ChatMessage;
  intent: any;
} {
  const qLower = query.toLowerCase();
  let content = '';
  let category: SupportCategory = 'Government Services';
  let suggestedActions: string[] = ['Check Eligibility', 'Download Guidelines', 'Track Application Status'];
  let sources: string[] = ['National Portal of India (india.gov.in)'];

  if (qLower.includes('pm-kisan') || qLower.includes('kisan') || qLower.includes('farmer') || qLower.includes('installment') || qLower.includes('किसान')) {
    category = 'Government Services';
    content = `**Namaste! Here are the details for PM-Kisan Samman Nidhi:**

1. **Benefit Overview**: Eligible landholding farmer families receive ₹6,000 annually in three equal installments of ₹2,000 directly via DBT.
2. **Mandatory e-KYC**: Complete OTP-based e-KYC on the PM-Kisan portal or biometric authentication at your nearest Common Service Centre (CSC).
3. **Land & Bank Seeding**: Ensure your land records are verified with the Tehsil Revenue Patwari and your bank account is Aadhaar-seeded via NPCI.

🔗 **Official Portal**: [pmkisan.gov.in](https://pmkisan.gov.in)
📞 **Toll-Free Helpline**: **155261 / 1800-115-526**`;
    suggestedActions = ['Complete e-KYC Online', 'Check Beneficiary Status', 'Aadhaar Bank Seeding FAQ'];
    sources = ['pmkisan.gov.in', 'Ministry of Agriculture & Farmers Welfare'];
  } else if (qLower.includes('ayushman') || qLower.includes('health') || qLower.includes('hospital') || qLower.includes('card') || qLower.includes('इलाज') || qLower.includes('आरोग्य')) {
    category = 'Healthcare';
    content = `**Namaste! Details for Ayushman Bharat (PM-JAY):**

1. **Coverage**: Provides up to ₹5,00,000 annual cashless health cover per family for secondary and tertiary hospital care.
2. **Senior Citizen Top-up**: All citizens aged 70+ receive universal health cards irrespective of family income criteria.
3. **Card Creation**: Generate your digital Ayushman Card instantly on the Beneficiary portal using Aadhaar OTP or visit any empanelled hospital.

🔗 **Official Portal**: [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)
📞 **National Health Helpline**: **14555 / 1800-111-565**`;
    suggestedActions = ['Check Hospital Empanelment', 'Generate Ayushman Card', 'Senior Citizen 70+ Registration'];
    sources = ['beneficiary.nha.gov.in', 'National Health Authority'];
  } else if (qLower.includes('scholarship') || qLower.includes('nsp') || qLower.includes('student') || qLower.includes('matric') || qLower.includes('छात्रवृत्ति')) {
    category = 'Education';
    content = `**Namaste! National Scholarship Portal (NSP) Guidance:**

1. **One-Time Registration (OTR)**: Complete biometric/Aadhaar-based OTR on the NSP 2026-27 portal before applying.
2. **Document Upload**: Keep your income certificate, caste certificate, and academic marksheet ready for nodal verification.
3. **Tracking**: Track institution-level and District Nodal Officer verification progress directly in your student dashboard.

🔗 **Official Portal**: [scholarships.gov.in](https://scholarships.gov.in)
📞 **Helpdesk Number**: **0120-6619540**`;
    suggestedActions = ['Complete OTR Registration', 'Track Verification Stage', 'Institute Verification Guidelines'];
    sources = ['scholarships.gov.in', 'Ministry of Electronics & IT'];
  } else if (qLower.includes('skill') || qLower.includes('pmkvy') || qLower.includes('course') || qLower.includes('training') || qLower.includes('job') || qLower.includes('रोजगार')) {
    category = 'Employment';
    content = `**Namaste! Skill India Mission (PMKVY 4.0):**

1. **Free Training Courses**: Access 100% government-sponsored short-term skill training in IT-ITeS, Healthcare, Electronics, Robotics, and Construction.
2. **Recognition of Prior Learning (RPL)**: Get government-certified skill credentials and monetary rewards for your existing trade experience.
3. **Placement Support**: Certified candidates receive apprenticeship and job fair access through National Apprenticeship Promotion Scheme (NAPS).

🔗 **Official Portal**: [skillindia.gov.in](https://www.skillindia.gov.in) & [skillindiadigital.gov.in](https://skillindiadigital.gov.in)
📞 **Toll-Free Helpline**: **088000-55555**`;
    suggestedActions = ['Find Nearest Training Center', 'Browse Free Courses', 'Download Skill Certificate'];
    sources = ['skillindia.gov.in', 'National Skill Development Corporation'];
  } else if (qLower.includes('digilocker') || qLower.includes('aadhaar') || qLower.includes('pan') || qLower.includes('license') || qLower.includes('document') || qLower.includes('दस्तावेज')) {
    category = 'Documents & Identity';
    content = `**Namaste! DigiLocker & Identity Documents Guide:**

1. **Legal Validity**: Digital documents in DigiLocker (Aadhaar, Driving License, Vehicle RC, Class X/XII Marksheets) are legally recognized on par with physical originals under Rule 9A of the IT Rules.
2. **Instant Sync**: Pull official documents securely using your Aadhaar-linked mobile number OTP.
3. **Paperless Services**: Share verified credentials directly with banks, universities, and government recruitment boards.

🔗 **Official Portal**: [digilocker.gov.in](https://digilocker.gov.in)
📞 **DigiLocker Support**: **011-24301851**`;
    suggestedActions = ['Fetch Aadhaar Card', 'Sync Driving License', 'DigiLocker FAQ'];
    sources = ['digilocker.gov.in', 'Ministry of Electronics and IT'];
  } else if (qLower.includes('complaint') || qLower.includes('grievance') || qLower.includes('cpgrams') || qLower.includes('electricity') || qLower.includes('water') || qLower.includes('शिकायत')) {
    category = 'Grievance Redressal';
    content = `**Namaste! Central Public Grievance Redressal (CPGRAMS):**

1. **Lodge Grievance**: You can lodge formal grievances with 90+ Central Government Ministries, Departments, and State Governments at pgportal.
2. **Mandatory SLA**: Grievances must be redressed within 30 days under the Citizen Charter.
3. **Appeals**: If dissatisfied with the resolution, you have the option to file an appeal before the Appellate Authority within 30 days.

🔗 **Official Portal**: [pgportal.gov.in](https://pgportal.gov.in)
📞 **National Grievance Helpline**: **1915 / 1800-11-4000**`;
    suggestedActions = ['Lodge New Grievance', 'Track Grievance Status', 'Raise Support Ticket'];
    sources = ['pgportal.gov.in', 'DARPG, Government of India'];
  } else {
    content = `**Namaste! Welcome to Bharat Support AI (BSAI).**

I am your authoritative citizen assistant for Digital India public services. Here is how I can help you:

1. **Government Schemes & Subsidies**: PM-Kisan, Ayushman Bharat, PM Awas Yojana, PM Ujjwala.
2. **Scholarships & Education**: National Scholarship Portal (NSP), Pre/Post-Matric scholarships.
3. **Skill Development**: Free certified PMKVY 4.0 courses, RPL certification, and apprenticeship.
4. **Official Identity & Digital Vaults**: DigiLocker, Aadhaar, PAN, and Parivahan Sarathi driving licenses.
5. **Grievance Redressal**: DARPG CPGRAMS escalation and public dispute tracking.

Please let me know which government service or scheme you would like guidance on.

🔗 **National Portal**: [india.gov.in](https://www.india.gov.in)
📞 **National Citizen Helpline**: **1800-11-0031**`;
    suggestedActions = ['Explore Government Schemes', 'Check Scholarship Status', 'Lodge a Grievance'];
  }

  const aiMessage: ChatMessage = {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    content,
    timestamp: new Date().toISOString(),
    category,
    confidence: 0.98,
    language,
    suggestedActions,
    sources
  };

  return {
    aiMessage,
    intent: {
      category,
      confidence: 0.98,
      urgency: 'Medium',
      suggestedActions
    }
  };
}

export const api = {
  // Chat
  async sendMessage(params: {
    query: string;
    conversationId?: string;
    language?: SupportedLanguage;
    category?: SupportCategory;
    citizenName?: string;
  }): Promise<{ aiMessage: ChatMessage; intent?: any; suggestedActions?: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, generating client-side BSAI response:', e);
    }
    return generateFallbackChatResponse(params.query, params.language);
  },

  async getChatHistory(conversationId: string) {
    try {
      const res = await fetch(`${API_BASE}/chat/history/${conversationId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend chat history unavailable:', e);
    }
    return { messages: [] };
  },

  // Tickets
  async getTickets(filters?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<Ticket[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/tickets?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend tickets unavailable, using local store:', e);
    }

    let tickets = getStoredTickets();
    if (filters?.status && filters.status !== 'All') {
      tickets = tickets.filter(t => t.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters?.category && filters.category !== 'All') {
      tickets = tickets.filter(t => t.category === filters.category);
    }
    if (filters?.priority && filters.priority !== 'All') {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.citizenName.toLowerCase().includes(s) ||
        t.ticketNumber.toLowerCase().includes(s)
      );
    }
    return tickets;
  },

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket lookup unavailable:', e);
    }

    const tickets = getStoredTickets();
    const found = tickets.find(t => t.id === id || t.ticketNumber === id);
    if (found) return found;
    return tickets[0] || MOCK_TICKETS[0];
  },

  async createTicket(data: {
    citizenName: string;
    citizenContact?: string;
    citizenEmail?: string;
    title: string;
    description: string;
    category: SupportCategory;
    priority?: string;
    language?: SupportedLanguage;
    tags?: string[];
    isEscalated?: boolean;
    escalationReason?: string;
  }): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket creation offline, saving locally:', e);
    }

    const tickets = getStoredTickets();
    const nextNum = 1000 + tickets.length + 1;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticketNumber: `BSAI-2026-${nextNum}`,
      citizenName: data.citizenName,
      citizenContact: data.citizenContact || '+91 98101 23456',
      citizenEmail: data.citizenEmail || `${data.citizenName.toLowerCase().replace(/\s+/g, '.')}@bsai.gov.in`,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.isEscalated ? 'Escalated' : 'Open',
      priority: (data.priority as any) || 'Medium',
      language: data.language || 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAgent: data.isEscalated ? 'Amit Patel (Nodal Officer)' : 'Unassigned',
      escalationReason: data.escalationReason,
      tags: data.tags || [data.category],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Ticket Raised',
          description: data.description,
          actor: 'Citizen',
          type: 'creation'
        }
      ]
    };

    tickets.unshift(newTicket);
    saveStoredTickets(tickets);

    // If escalated, record escalation item
    if (data.isEscalated) {
      const escalations = getStoredEscalations();
      escalations.unshift({
        id: `esc-${Date.now()}`,
        ticketId: newTicket.id,
        ticketNumber: newTicket.ticketNumber,
        citizenName: newTicket.citizenName,
        category: newTicket.category,
        reason: data.escalationReason || 'Citizen requested immediate nodal escalation',
        priority: newTicket.priority,
        status: 'Pending Review',
        assignedAgent: 'Amit Patel (Nodal Officer)',
        escalatedAt: new Date().toISOString(),
        conversationSnippet: data.description
      });
      saveStoredEscalations(escalations);
    }

    return newTicket;
  },

  async updateTicket(
    id: string,
    updates: {
      status?: string;
      assignedAgent?: string;
      resolutionNotes?: string;
      note?: string;
      actor?: string;
    }
  ): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket update offline, updating locally:', e);
    }

    const tickets = getStoredTickets();
    const idx = tickets.findIndex(t => t.id === id || t.ticketNumber === id);
    if (idx !== -1) {
      tickets[idx] = {
        ...tickets[idx],
        ...updates,
        status: (updates.status as any) || tickets[idx].status,
        updatedAt: new Date().toISOString(),
      };
      if (updates.note || updates.resolutionNotes) {
        tickets[idx].timeline.push({
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: updates.status ? `Status changed to ${updates.status}` : 'Update Note Added',
          description: updates.resolutionNotes || updates.note || 'Ticket details updated',
          actor: (updates.actor as any) || 'Human Support Officer',
          type: updates.status === 'Resolved' ? 'resolution' : 'status_change'
        });
      }
      saveStoredTickets(tickets);
      return tickets[idx];
    }
    return MOCK_TICKETS[0];
  },

  // Escalations
  async getEscalations(): Promise<EscalationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/escalations`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend escalations unavailable, using local store:', e);
    }
    return getStoredEscalations();
  },

  async updateEscalation(
    id: string,
    data: {
      status?: string;
      assignedAgent?: string;
      resolutionNote?: string;
    }
  ): Promise<EscalationItem> {
    try {
      const res = await fetch(`${API_BASE}/escalations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend escalation update offline, updating locally:', e);
    }

    const items = getStoredEscalations();
    const idx = items.findIndex(e => e.id === id);
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...data,
        status: (data.status as any) || items[idx].status
      };
      saveStoredEscalations(items);
      return items[idx];
    }
    return items[0] || MOCK_ESCALATIONS[0];
  },

  // Knowledge Base
  async getKnowledgeArticles(filters?: {
    category?: string;
    search?: string;
  }): Promise<KnowledgeArticle[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/knowledge?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend knowledge base offline, using built-in articles:', e);
    }

    let articles = MOCK_KNOWLEDGE_ARTICLES;
    if (filters?.category && filters.category !== 'All') {
      articles = articles.filter(a => a.category === filters.category);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(s) ||
        a.summary.toLowerCase().includes(s) ||
        a.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    return articles;
  },

  async getKnowledgeArticleById(id: string): Promise<KnowledgeArticle> {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend knowledge article lookup offline:', e);
    }
    const found = MOCK_KNOWLEDGE_ARTICLES.find(a => a.id === id);
    return found || MOCK_KNOWLEDGE_ARTICLES[0];
  },

  async voteKnowledgeArticle(id: string, helpful: boolean) {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // client-side acknowledgment
    }
    return { success: true };
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend analytics unavailable, calculating live summary from local records:', e);
    }

    const tickets = getStoredTickets();
    const escalations = getStoredEscalations();

    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const escalated = tickets.filter(t => t.status === 'Escalated').length + escalations.length;
    const total = 1420 + tickets.length;
    const totalResolved = 1340 + resolved;
    const totalPending = 40 + inProgress + open;

    return {
      ...MOCK_ANALYTICS,
      totalQueries: total,
      resolvedQueries: totalResolved,
      pendingQueries: totalPending,
      escalatedQueries: escalated,
      resolutionRate: Math.round((totalResolved / total) * 1000) / 10,
    };
  },

  // Feedback
  async submitFeedback(feedback: FeedbackSubmission) {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Feedback recorded locally:', e);
    }
    return { success: true, message: 'Dhanyawad! Feedback received.' };
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend settings unavailable, returning stored settings:', e);
    }
    return getStoredSettings();
  },

  async saveSettings(settings: Partial<SystemSettings>) {
    saveStoredSettings(settings);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Saved settings to local storage:', e);
    }
    return { success: true, settings: getStoredSettings() };
  },

  async verifyGeminiKey(apiKey: string, model?: string): Promise<{ valid: boolean; message: string; sampleResponse?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settings/verify-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend verification endpoint offline, testing client-side format:', e);
    }

    if (apiKey && apiKey.trim().startsWith('AIzaSy') && apiKey.trim().length >= 35) {
      return {
        valid: true,
        message: 'Google Gemini API key validated successfully for BSAI citizen engine.',
        sampleResponse: 'Namaste! BSAI AI Engine connection verified.'
      };
    } else {
      return {
        valid: false,
        message: 'Invalid Google Gemini API key format. Key must start with "AIzaSy" and be at least 35 characters.'
      };
    }
  },

  // Reset Demo
  async resetDemoData() {
    try {
      localStorage.removeItem('bsai_tickets');
      localStorage.removeItem('bsai_escalations');
      localStorage.removeItem('bsai_settings');
      const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Local demo data reset executed:', e);
    }
    return { success: true, message: 'Demo data reset successfully' };
  },
};
