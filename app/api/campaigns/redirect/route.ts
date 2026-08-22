import { ApiError, apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { CampaignLog } from '@/models/CampaignLog';
import { readJson, nonNegativeNumber, requiredString } from '@/lib/validation';
import { NextResponse } from 'next/server';
import type { CampaignRedirectInput } from '@/types/talkops';
import { serializeCampaignLog } from '@/lib/serializers';

const partnerUrls = {
  interakt: process.env.NEXT_PUBLIC_INTERAKT_REFERRAL_URL || 'https://www.interakt.shop/',
  aisensy: process.env.NEXT_PUBLIC_AISENSY_REFERRAL_URL || 'https://aisensy.com/',
};

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await readJson<CampaignRedirectInput>(request);
    if (body.partner !== 'interakt' && body.partner !== 'aisensy') throw new ApiError(400, 'Invalid campaign partner.');
    await connectToDatabase();
    const log = await CampaignLog.create({
      userId: user._id,
      campaignName: requiredString(body.campaignName, 'Campaign name', 160),
      campaignText: requiredString(body.campaignText, 'Campaign text', 10_000),
      contactCount: nonNegativeNumber(body.contactCount, 'Contact count'),
      status: 'redirected',
      redirectedToPartner: partnerUrls[body.partner],
    });
    return NextResponse.json({ data: { campaign: serializeCampaignLog(log), redirectUrl: partnerUrls[body.partner] } }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
