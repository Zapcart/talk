import type { Agent, CallLog, CampaignLog, TalkOpsUser } from '@/types/talkops';

interface MongoRecord {
  _id: { toString(): string };
  createdAt: Date;
  updatedAt?: Date;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  firebaseUid?: unknown;
  role?: unknown;
  status?: unknown;
  subscriptionPlan?: unknown;
  minutesBalance?: unknown;
  isPaid?: unknown;
  userId?: unknown;
  agentId?: unknown;
  agentName?: unknown;
  language?: unknown;
  systemPrompt?: unknown;
  voiceId?: unknown;
  twilioPhoneNumber?: unknown;
  businessProfile?: unknown;
  faqs?: unknown;
  pricing?: unknown;
  callerNumber?: unknown;
  duration?: unknown;
  transcript?: unknown;
  summary?: unknown;
  leadTemperature?: unknown;
  campaignName?: unknown;
  contactCount?: unknown;
  redirectedToPartner?: unknown;
}

export function serializeUser(record: MongoRecord): TalkOpsUser {
  return {
    id: record._id.toString(),
    name: String(record.name || ''),
    email: String(record.email || ''),
    phone: String(record.phone || ''),
    firebaseUid: String(record.firebaseUid || ''),
    role: record.role === 'admin' ? 'admin' : 'user',
    status: record.status === 'disabled' ? 'disabled' : 'active',
    subscriptionPlan: String(record.subscriptionPlan || 'starter'),
    minutesBalance: Number(record.minutesBalance || 0),
    isPaid: Boolean(record.isPaid),
    createdAt: record.createdAt.toISOString(),
    updatedAt: (record.updatedAt || record.createdAt).toISOString(),
  };
}

export function serializeAgent(record: MongoRecord): Agent {
  return {
    id: record._id.toString(),
    userId: String(record.userId),
    agentName: String(record.agentName),
    language: record.language === 'Hindi' || record.language === 'Hinglish' ? record.language : 'English',
    systemPrompt: String(record.systemPrompt),
    voiceId: String(record.voiceId),
    twilioPhoneNumber: String(record.twilioPhoneNumber),
    status: record.status === 'inactive' ? 'inactive' : 'active',
    businessProfile: String(record.businessProfile || ''),
    faqs: String(record.faqs || ''),
    pricing: String(record.pricing || ''),
    createdAt: record.createdAt.toISOString(),
    updatedAt: (record.updatedAt || record.createdAt).toISOString(),
  };
}

export function serializeCallLog(record: MongoRecord): CallLog {
  const agent = record.agentId as MongoRecord | string;
  const user = record.userId as MongoRecord | string;
  const agentPopulated = typeof agent === 'object' && '_id' in agent;
  const userPopulated = typeof user === 'object' && '_id' in user;

  return {
    id: record._id.toString(),
    userId: userPopulated ? user._id.toString() : String(user),
    agentId: agentPopulated ? agent._id.toString() : String(agent),
    callerNumber: String(record.callerNumber),
    duration: Number(record.duration || 0),
    transcript: String(record.transcript || ''),
    summary: String(record.summary || ''),
    leadTemperature: record.leadTemperature === 'Hot' || record.leadTemperature === 'Cold' ? record.leadTemperature : 'Warm',
    createdAt: record.createdAt.toISOString(),
    agent: agentPopulated
      ? { id: agent._id.toString(), agentName: String(agent.agentName), twilioPhoneNumber: String(agent.twilioPhoneNumber) }
      : undefined,
    user: userPopulated
      ? { id: user._id.toString(), name: String(user.name || ''), email: String(user.email || '') }
      : undefined,
  };
}

export function serializeCampaignLog(record: MongoRecord): CampaignLog {
  return {
    id: record._id.toString(),
    userId: String(record.userId),
    campaignName: String(record.campaignName),
    contactCount: Number(record.contactCount || 0),
    status: record.status === 'failed' || record.status === 'draft' ? record.status : 'redirected',
    redirectedToPartner: String(record.redirectedToPartner || ''),
    createdAt: record.createdAt.toISOString(),
  };
}
