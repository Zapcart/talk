import { apiErrorResponse, requireUser } from '@/lib/auth-server';
import { NextResponse } from 'next/server';

const AGENT_PRICE_PAISE = 249900;

export async function POST(request: Request) {
  try {
    await requireUser(request);
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !secret) {
      return NextResponse.json({ error: 'Razorpay is not configured on the server.' }, { status: 503 });
    }

    const credential = Buffer.from(`${keyId}:${secret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credential}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: AGENT_PRICE_PAISE, currency: 'INR', receipt: `talkops_${Date.now()}`, notes: { product: 'agent_provisioning' } }),
    });

    if (!response.ok) throw new Error('Razorpay order creation failed.');
    const order = (await response.json()) as { id: string; amount: number; currency: 'INR' };
    return NextResponse.json({ data: { id: order.id, amount: order.amount, currency: order.currency, keyId } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
