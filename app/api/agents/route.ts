import { createHmac, timingSafeEqual } from 'node:crypto';
import { ApiError, apiErrorResponse, requireUser } from '@/lib/auth-server';
import { connectToDatabase } from '@/lib/mongodb';
import { Agent } from '@/models/Agent';
import { readJson, requiredString } from '@/lib/validation';
import { serializeAgent } from '@/lib/serializers';
import { NextResponse } from 'next/server';
import type { AgentCreateInput } from '@/types/talkops';

const AGENT_PRICE_PAISE = 249900;

async function verifyPayment(input: AgentCreateInput['payment']) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) throw new ApiError(503, 'Razorpay is not configured on the server.');

  const orderId = requiredString(input?.razorpayOrderId, 'Razorpay order ID', 100);
  const paymentId = requiredString(input?.razorpayPaymentId, 'Razorpay payment ID', 100);
  const signature = requiredString(input?.razorpaySignature, 'Razorpay signature', 200);
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');
  if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) {
    throw new ApiError(400, 'Payment verification failed.');
  }

  const credential = Buffer.from(`${keyId}:${secret}`).toString('base64');
  const headers = { Authorization: `Basic ${credential}` };
  const [orderResponse, paymentResponse] = await Promise.all([
    fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, { headers, cache: 'no-store' }),
    fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers, cache: 'no-store' }),
  ]);
  if (!orderResponse.ok || !paymentResponse.ok) throw new ApiError(400, 'Payment could not be confirmed with Razorpay.');

  const order = (await orderResponse.json()) as { id: string; amount: number; amount_paid: number; currency: string; status: string; notes?: { product?: string } };
  const payment = (await paymentResponse.json()) as { id: string; order_id: string; amount: number; currency: string; status: string };
  const validOrder = order.id === orderId && order.amount === AGENT_PRICE_PAISE && order.amount_paid === AGENT_PRICE_PAISE && order.currency === 'INR' && order.status === 'paid' && order.notes?.product === 'agent_provisioning';
  const validPayment = payment.id === paymentId && payment.order_id === orderId && payment.amount === AGENT_PRICE_PAISE && payment.currency === 'INR' && payment.status === 'captured';
  if (!validOrder || !validPayment) throw new ApiError(400, 'Payment is not complete or does not match this purchase.');

  return { orderId, paymentId };
}

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    await connectToDatabase();
    const agents = await Agent.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: agents.map((agent) => serializeAgent(agent)) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await readJson<AgentCreateInput>(request);
    const language = body.language;
    if (!['Hindi', 'Hinglish', 'English'].includes(language)) throw new ApiError(400, 'Invalid language.');
    const payment = await verifyPayment(body.payment);
    await connectToDatabase();
    const existingAgent = await Agent.exists({ paymentOrderId: payment.orderId });
    if (existingAgent) throw new ApiError(409, 'This payment has already been used to provision an agent.');
    const agent = await Agent.create({
      userId: user._id,
      agentName: requiredString(body.agentName, 'Agent name', 100),
      language,
      systemPrompt: requiredString(body.systemPrompt, 'System prompt'),
      voiceId: requiredString(body.voiceId, 'Voice'),
      twilioPhoneNumber: requiredString(body.twilioPhoneNumber, 'Phone number', 40),
      businessProfile: body.businessProfile?.trim().slice(0, 10_000) || '',
      faqs: body.faqs?.trim().slice(0, 20_000) || '',
      pricing: body.pricing?.trim().slice(0, 10_000) || '',
      status: 'active',
      paymentOrderId: payment.orderId,
      paymentId: payment.paymentId,
    });
    return NextResponse.json({ data: serializeAgent(agent) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
