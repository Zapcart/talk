import { ApiError, apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { readJson } from '@/lib/validation';
import { NextResponse } from 'next/server';
import type { AuthSyncInput } from '@/types/talkops';
import { serializeUser } from '@/lib/serializers';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization) return NextResponse.json({ error: 'A Firebase ID token is required.' }, { status: 401 });

    const existingUser = await requireUser(request).catch((error) => {
      if (error instanceof ApiError && error.status === 403 && error.message === 'Your TalkOps profile has not been synchronized.') return null;
      throw error;
    });
    const body = await readJson<AuthSyncInput>(request);

    if (existingUser) {
      if (body.name || body.phone) {
        await connectToDatabase();
        const updated = await User.findByIdAndUpdate(existingUser._id, {
          ...(body.name ? { name: body.name.trim().slice(0, 120) } : {}),
          ...(body.phone ? { phone: body.phone.trim().slice(0, 40) } : {}),
        }, { new: true });
        return NextResponse.json({ data: serializeUser(updated) });
      }
      return NextResponse.json({ data: serializeUser(existingUser) });
    }

    const firebaseUid = (await import('@/lib/firebase-admin')).getFirebaseAdminAuth();
    const decoded = await firebaseUid.verifyIdToken(authorization.slice(7).trim());
    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $setOnInsert: {
          firebaseUid: decoded.uid,
          email: body.email?.trim() || decoded.email || '',
          name: body.name?.trim() || decoded.name || '',
          phone: body.phone?.trim() || decoded.phone_number || '',
          role: 'user',
          status: 'active',
          subscriptionPlan: 'starter',
          minutesBalance: 0,
          isPaid: false,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
