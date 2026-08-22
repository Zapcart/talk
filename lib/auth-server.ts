import { getFirebaseAdminAuth } from '@/lib/firebase-admin';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import type { UserRole } from '@/types/talkops';
import type { Document, Types } from 'mongoose';
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export interface AuthenticatedUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  firebaseUid: string;
  role: UserRole;
  status: 'active' | 'disabled';
  subscriptionPlan: string;
  minutesBalance: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function requireUser(
  request: Request,
  requiredRole?: UserRole,
): Promise<AuthenticatedUserDocument> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new ApiError(401, 'A Firebase ID token is required.');
  }

  const token = authorization.slice(7).trim();
  if (!token) throw new ApiError(401, 'A Firebase ID token is required.');

  let firebaseUid: string;
  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    firebaseUid = decoded.uid;
  } catch {
    throw new ApiError(401, 'The authentication token is invalid or expired.');
  }

  await connectToDatabase();
  const user = (await User.findOne({ firebaseUid })) as AuthenticatedUserDocument | null;
  if (!user) throw new ApiError(403, 'Your TalkOps profile has not been synchronized.');
  if (user.status === 'disabled') throw new ApiError(403, 'This account has been disabled.');
  if (requiredRole && user.role !== requiredRole) throw new ApiError(403, 'You do not have permission to access this resource.');

  return user;
}

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
}
