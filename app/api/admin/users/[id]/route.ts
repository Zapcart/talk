import { ApiError, apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { serializeUser } from '@/lib/serializers';
import { nonNegativeNumber, readJson } from '@/lib/validation';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

interface UserUpdateInput {
  subscriptionPlan?: string;
  minutesBalance?: number;
  status?: 'active' | 'disabled';
  isPaid?: boolean;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireUser(request, 'admin');
    const { id } = await context.params;
    const body = await readJson<UserUpdateInput>(request);
    const update: UserUpdateInput = {};

    if (body.subscriptionPlan !== undefined) {
      if (typeof body.subscriptionPlan !== 'string' || !body.subscriptionPlan.trim()) {
        throw new ApiError(400, 'Subscription plan is required.');
      }
      update.subscriptionPlan = body.subscriptionPlan.trim().slice(0, 80);
    }
    if (body.minutesBalance !== undefined) update.minutesBalance = nonNegativeNumber(body.minutesBalance, 'Minutes balance');
    if (body.status !== undefined) {
      if (!['active', 'disabled'].includes(body.status)) throw new ApiError(400, 'Invalid user status.');
      if (admin._id.toString() === id && body.status === 'disabled') throw new ApiError(400, 'You cannot disable your own admin account.');
      update.status = body.status;
    }
    if (body.isPaid !== undefined) update.isPaid = Boolean(body.isPaid);
    if (!Object.keys(update).length) throw new ApiError(400, 'No supported user fields were provided.');

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!user) throw new ApiError(404, 'User not found.');
    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
