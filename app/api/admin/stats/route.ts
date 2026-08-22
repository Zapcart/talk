import { apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { Agent } from '@/models/Agent';
import { CallLog } from '@/models/CallLog';
import { CampaignLog } from '@/models/CampaignLog';
import { User } from '@/models/User';
import { serializeCallLog, serializeUser } from '@/lib/serializers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await requireUser(request, 'admin');
    await connectToDatabase();
    const [totalUsers, activeAgents, callMinutes, campaignsTriggered, paidUsers, affiliateRedirections, users, callLogs] = await Promise.all([
      User.countDocuments(),
      Agent.countDocuments({ status: 'active' }),
      CallLog.aggregate([{ $group: { _id: null, seconds: { $sum: '$duration' } } }]),
      CampaignLog.countDocuments({ status: 'redirected' }),
      User.countDocuments({ isPaid: true }),
      CampaignLog.countDocuments({ status: 'redirected', redirectedToPartner: { $exists: true, $ne: '' } }),
      User.find().sort({ createdAt: -1 }).limit(100).lean(),
      CallLog.find().populate('agentId', 'agentName twilioPhoneNumber').populate('userId', 'name email').sort({ createdAt: -1 }).limit(100).lean(),
    ]);
    const seconds = Number(callMinutes[0]?.seconds || 0);
    return NextResponse.json({ data: {
      stats: {
        totalUsers,
        activeAgents,
        callMinutesConsumed: Math.round((seconds / 60) * 100) / 100,
        campaignsTriggered,
        paidUsers,
        estimatedRevenue: paidUsers * 2499,
        affiliateRedirections,
      },
      users: users.map((user) => serializeUser(user)),
      callLogs: callLogs.map((log) => serializeCallLog(log)),
    } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
