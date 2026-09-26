import {
  Ticket,
  KnowledgeArticle,
  EscalationItem,
  AnalyticsSummary,
  SystemSettings,
  FeedbackSubmission,
  SupportedLanguage,
  SupportCategory
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';

export const api = {
  // Chat
  async sendMessage(params: {
    query: string;
    conversationId?: string;
    language?: SupportedLanguage;
    category?: SupportCategory;
    citizenName?: string;
  }) {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getChatHistory(conversationId: string) {
    const res = await fetch(`${API_BASE}/chat/history/${conversationId}`);
    if (!res.ok) throw new Error('Failed to load chat history');
    return res.json();
  },

  // Tickets
  async getTickets(filters?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/tickets?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },

  async getTicketById(id: string): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch ticket');
    return res.json();
  },

  async createTicket(data: {
    citizenName: string;
    citizenContact?: string;
    title: string;
    description: string;
    category: SupportCategory;
    priority?: string;
    language?: SupportedLanguage;
    tags?: string[];
    isEscalated?: boolean;
    escalationReason?: string;
  }): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
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
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  },

  // Escalations
  async getEscalations(): Promise<EscalationItem[]> {
    const res = await fetch(`${API_BASE}/escalations`);
    if (!res.ok) throw new Error('Failed to fetch escalations');
    return res.json();
  },

  async updateEscalation(
    id: string,
    data: {
      status?: string;
      assignedAgent?: string;
      resolutionNote?: string;
    }
  ): Promise<EscalationItem> {
    const res = await fetch(`${API_BASE}/escalations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update escalation');
    return res.json();
  },

  // Knowledge Base
  async getKnowledgeArticles(filters?: {
    category?: string;
    search?: string;
  }): Promise<KnowledgeArticle[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/knowledge?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge base');
    return res.json();
  },

  async getKnowledgeArticleById(id: string): Promise<KnowledgeArticle> {
    const res = await fetch(`${API_BASE}/knowledge/${id}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge article');
    return res.json();
  },

  async voteKnowledgeArticle(id: string, helpful: boolean) {
    const res = await fetch(`${API_BASE}/knowledge/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helpful }),
    });
    if (!res.ok) throw new Error('Failed to submit vote');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Feedback
  async submitFeedback(feedback: FeedbackSubmission) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async saveSettings(settings: Partial<SystemSettings>) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  },

  async verifyGeminiKey(apiKey: string, model?: string): Promise<{ valid: boolean; message: string; sampleResponse?: string }> {
    const res = await fetch(`${API_BASE}/settings/verify-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model }),
    });
    return res.json();
  },

  // Reset Demo
  async resetDemoData() {
    const res = await fetch(`${API_BASE}/reset-demo`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  },
};
