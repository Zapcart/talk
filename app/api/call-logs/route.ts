import { apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { CallLog } from '@/models/CallLog';
import { serializeCallLog } from '@/lib/serializers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const limitParam = new URL(request.url).searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 50, 1), 100);
    await connectToDatabase();
    const logs = await CallLog.find({ userId: user._id })
      .populate('agentId', 'agentName twilioPhoneNumber')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return NextResponse.json({ data: logs.map((log) => serializeCallLog(log)) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
