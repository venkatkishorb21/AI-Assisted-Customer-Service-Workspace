export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type CaseStatus = 
  | 'Open' 
  | 'In Progress' 
  | 'Escalated' 
  | 'Pending Follow-up' 
  | 'Resolved' 
  | 'Closed';

export type IssueCategory = 
  | 'Billing & Invoicing' 
  | 'Technical & API Outage' 
  | 'Hardware & Telematics' 
  | 'Account & Access' 
  | 'On-Ground Logistics' 
  | 'Service Cancellation';

export type ChannelType = 'Voice Call' | 'Live Chat' | 'Support Email' | 'Field Report';

export type AgentStatus = 'Available' | 'In Call' | 'Wrap-up' | 'Break' | 'Offline';

export type UserRole = 
  | 'Tier 1 Support Agent' 
  | 'Senior Operations Specialist' 
  | 'Support Team Lead / Supervisor';

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: AgentStatus;
  department: string;
  callsHandledToday: number;
  resolvedToday: number;
  avgHandlingTimeMin: number; // e.g. 4.8 minutes
  csatRating: number; // e.g. 4.9 out of 5
  activeCaseId?: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string; // ISO string or relative time
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'critical';
}

export interface InternalNote {
  id: string;
  author: string;
  authorRole: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
}

export interface FollowUpSchedule {
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  method: 'Phone Call' | 'Video Call' | 'Email' | 'Field Technician Visit';
  notes: string;
  assignedAgent: string;
  completed: boolean;
  completedAt?: string;
}

export interface AiSuggestionData {
  summary: string;
  keyConcerns: string[];
  sentiment: 'Frustrated / Urgent' | 'Dissatisfied' | 'Neutral' | 'Inquiring' | 'Pleased';
  escalationRisk: 'High' | 'Moderate' | 'Low';
  escalationTriggerReason?: string;
  suggestedResponse: string;
  recommendedAction: string;
  explanation: string;
  confidenceScore: number; // percentage, e.g. 94%
  applicablePolicy: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  tier: 'Enterprise VIP' | 'Growth Corporate' | 'Standard Pro';
  accountSince: string;
  lifetimeValue: string;
  satisfactionScore: number; // 0-100
  totalTicketsCount: number;
  openTicketsCount: number;
  avatarUrl?: string;
}

export interface SupportCase {
  id: string; // e.g. "CAS-8902"
  title: string;
  customer: CustomerProfile;
  category: IssueCategory;
  priority: PriorityLevel;
  status: CaseStatus;
  channel: ChannelType;
  assignedAgentId: string;
  assignedAgentName: string;
  waitingTimeMinutes: number; // wait in queue
  handlingDurationMinutes: number; // active handling time
  createdAt: string;
  slaDue: string; // e.g. "18 mins remaining" or "Breached"
  isSlaBreached: boolean;
  transcript: Message[];
  internalNotes: InternalNote[];
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  followUp?: FollowUpSchedule;
  aiInsights: AiSuggestionData;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

export interface DailyMetricPoint {
  date: string;
  totalCalls: number;
  resolvedCases: number;
  escalatedCases: number;
  avgHandlingMinutes: number;
  slaCompliancePct: number;
}
