export type SupportCategory = 
  | 'Government Services'
  | 'Education'
  | 'Healthcare'
  | 'Employment'
  | 'Grievance Redressal'
  | 'Documents & Identity'
  | 'Agriculture & Rural'
  | 'Banking & DBT'
  | 'Other Citizen Services';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn';

export type UserRole = 'Citizen' | 'Nodal Officer' | 'Support Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  state?: string;
  role: UserRole;
  avatarInitials: string;
  preferredLanguage: SupportedLanguage;
  createdAt?: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ticket_update' | 'escalation' | 'system' | 'resolution';
  timestamp: string;
  read: boolean;
  ticketId?: string;
}

export interface Ticket {
  id: string;
  userId?: string;
  ticketNumber: string;
  citizenName: string;
  citizenEmail?: string;
  citizenContact?: string;
  title: string;
  description: string;
  category: SupportCategory;
  status: TicketStatus;
  priority: TicketPriority;
  language: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  resolutionNotes?: string;
  timeline: TicketTimelineEvent[];
  escalationReason?: string;
  tags?: string[];
}

export interface TicketTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'Citizen' | 'BSAI Assistant' | 'Human Support Officer' | 'System';
  type: 'creation' | 'ai_reply' | 'escalation' | 'agent_assignment' | 'status_change' | 'resolution';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  content: string;
  timestamp: string;
  category?: SupportCategory;
  confidence?: number;
  language?: SupportedLanguage;
  suggestedActions?: string[];
  sources?: string[];
  requiresHumanReview?: boolean;
  ticketId?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  titleHi: string;
  category: SupportCategory;
  summary: string;
  summaryHi: string;
  content: string;
  contentHi: string;
  tags: string[];
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  lastUpdated: string;
  officialPortalUrl?: string;
  helplineNumber?: string;
}

export interface EscalationItem {
  id: string;
  ticketId: string;
  ticketNumber: string;
  citizenName: string;
  category: SupportCategory;
  priority: TicketPriority;
  status: 'Pending Review' | 'Agent Assigned' | 'Resolved';
  reason: string;
  escalatedAt: string;
  assignedAgent?: string;
  conversationSnippet?: string;
}

export interface FeedbackSubmission {
  id?: string;
  ticketId?: string;
  conversationId?: string;
  rating: number; // 1 to 5
  helpful: boolean;
  category?: SupportCategory;
  comments?: string;
  timestamp?: string;
}

export interface AnalyticsSummary {
  totalQueries: number;
  resolvedQueries: number;
  pendingQueries: number;
  escalatedQueries: number;
  resolutionRate: number; // %
  averageResponseTimeSec: number;
  customerSatisfaction: number; // e.g. 4.8 / 5
  escalationRate: number; // %
  categoryDistribution: { category: SupportCategory; count: number; percentage: number }[];
  languageDistribution: { language: string; code: SupportedLanguage; count: number; percentage: number }[];
  statusBreakdown: { status: TicketStatus; count: number }[];
  dailyTrends: { date: string; queries: number; resolved: number; escalated: number }[];
  recentActivity: {
    id: string;
    type: 'query' | 'ticket' | 'escalation' | 'resolution' | 'feedback';
    title: string;
    description: string;
    timestamp: string;
    category?: SupportCategory;
    priority?: TicketPriority;
  }[];
}

export interface SystemSettings {
  aiModel: 'bsai-neural-local' | 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gpt-4o-mini';
  aiTemperature: number;
  autoEscalationThreshold: number; // e.g. 0.70
  defaultLanguage: SupportedLanguage;
  enableVoiceSynthesis: boolean;
  enableSoundEffects: boolean;
  reducedMotion3D: boolean;
  themeMode: 'light';
  notificationsEnabled: boolean;
  apiKeySet: boolean;
  geminiApiKey?: string;
  geminiModel?: string;
}
