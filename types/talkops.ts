export const USER_ROLES = ['user', 'admin'] as const;
export const AGENT_LANGUAGES = ['Hindi', 'Hinglish', 'English'] as const;
export const AGENT_STATUSES = ['active', 'inactive'] as const;
export const LEAD_TEMPERATURES = ['Hot', 'Warm', 'Cold'] as const;
export const USER_STATUSES = ['active', 'disabled'] as const;
export const CAMPAIGN_STATUSES = ['draft', 'redirected', 'failed'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type AgentLanguage = (typeof AGENT_LANGUAGES)[number];
export type AgentStatus = (typeof AGENT_STATUSES)[number];
export type LeadTemperature = (typeof LEAD_TEMPERATURES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export interface TalkOpsUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  firebaseUid: string;
  role: UserRole;
  status: UserStatus;
  subscriptionPlan: string;
  minutesBalance: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  agentName: string;
  language: AgentLanguage;
  systemPrompt: string;
  voiceId: string;
  twilioPhoneNumber: string;
  status: AgentStatus;
  businessProfile?: string;
  faqs?: string;
  pricing?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallLog {
  id: string;
  userId: string;
  agentId: string;
  callerNumber: string;
  duration: number;
  transcript: string;
  summary: string;
  leadTemperature: LeadTemperature;
  createdAt: string;
  agent?: Pick<Agent, 'id' | 'agentName' | 'twilioPhoneNumber'>;
  user?: Pick<TalkOpsUser, 'id' | 'name' | 'email'>;
}

export interface CampaignLog {
  id: string;
  userId: string;
  campaignName: string;
  contactCount: number;
  status: CampaignStatus;
  redirectedToPartner: string;
  createdAt: string;
}

export interface RazorpayPaymentVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: 'INR';
  keyId: string;
}

export interface AgentCreateInput {
  agentName: string;
  language: AgentLanguage;
  systemPrompt: string;
  voiceId: string;
  twilioPhoneNumber: string;
  businessProfile: string;
  faqs: string;
  pricing: string;
  payment: RazorpayPaymentVerification;
}

export interface CampaignRedirectInput {
  campaignName: string;
  campaignText: string;
  contactCount: number;
  partner: 'interakt' | 'aisensy';
}

export interface AuthSyncInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeAgents: number;
  callMinutesConsumed: number;
  campaignsTriggered: number;
  paidUsers: number;
  estimatedRevenue: number;
  affiliateRedirections: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  users: TalkOpsUser[];
  callLogs: CallLog[];
}

export interface ApiSuccess<T> {
  data: T;
  error?: never;
}

export interface ApiFailure {
  data?: never;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
