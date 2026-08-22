'use client';

import { authenticatedFetch } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import type { Agent, AgentCreateInput, RazorpayOrder, RazorpayPaymentVerification } from '@/types/talkops';
import { Check, ChevronLeft, ChevronRight, CreditCard, LoaderCircle, Mic2, Play, Volume2 } from 'lucide-react';
import Script from 'next/script';
import { useMemo, useState } from 'react';

const voices = ['Mara', 'Theo', 'Aria'];
const phoneNumbers = (process.env.NEXT_PUBLIC_DEFAULT_TWILIO_PHONE_NUMBERS || '+918047120001,+918047120002,+918047120003').split(',');

export default function AgentConfigurator({ onCreated }: { onCreated?: (agent: Agent) => void }) {
  const { firebaseUser } = useAuth();
  const [step, setStep] = useState(1);
  const [voice, setVoice] = useState('Mara');
  const [language, setLanguage] = useState<AgentCreateInput['language']>('English');
  const [agentName, setAgentName] = useState('Renewal assistant');
  const [businessProfile, setBusinessProfile] = useState('We help Indian businesses automate customer conversations and follow-ups.');
  const [faqs, setFaqs] = useState('Answer common pricing, support, and availability questions clearly.');
  const [pricing, setPricing] = useState('Starter from Rs. 2,499/month.');
  const [systemPrompt, setSystemPrompt] = useState('Help customers understand the right plan, confirm their requirements, and schedule a follow-up. Be concise, warm, and honest.');
  const [phoneNumber, setPhoneNumber] = useState(phoneNumbers[0]);
  const [previewText, setPreviewText] = useState('Namaste, how can I help you today?');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Agent | null>(null);
  const [error, setError] = useState('');

  const canContinue = useMemo(() => {
    if (step === 1) return agentName.trim().length > 0 && businessProfile.trim().length > 0;
    if (step === 2) return systemPrompt.trim().length > 0;
    return Boolean(phoneNumber);
  }, [agentName, businessProfile, phoneNumber, step, systemPrompt]);

  function previewVoice() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(previewText);
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }

  async function openRazorpay() {
    if (!firebaseUser) return;
    if (!window.Razorpay) {
      setError('Secure checkout is still loading. Please try again in a moment.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const order = await authenticatedFetch<RazorpayOrder>(firebaseUser, '/api/payments/order', { method: 'POST' });
      new window.Razorpay({
        key: order.keyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'TalkOps',
        description: 'AI agent provisioning',
        handler: (response: RazorpayCheckoutResponse) => void createAgent({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
        modal: { ondismiss: () => setSaving(false) },
      }).open();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start secure checkout.');
      setSaving(false);
    }
  }

  async function createAgent(payment: RazorpayPaymentVerification) {
    if (!firebaseUser) return;
    setSaving(true);
    setError('');
    try {
      const agent = await authenticatedFetch<Agent>(firebaseUser, '/api/agents/create', {
        method: 'POST',
        body: JSON.stringify({ agentName, language, systemPrompt, voiceId: voice, twilioPhoneNumber: phoneNumber, businessProfile, faqs, pricing, payment }),
      });
      setSaved(agent);
      onCreated?.(agent);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to provision the agent.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="agents" className="scroll-mt-20" aria-labelledby="agent-title">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onError={() => setError('Secure checkout could not be loaded. Please retry after checking your connection.')}
      />
      <div className="mb-5 flex items-end justify-between">
        <div><p className="eyebrow">Agent studio</p><h2 id="agent-title" className="mt-2 text-xl font-semibold">Configure agent</h2></div>
        <span className="hidden items-center gap-2 text-xs text-acid sm:flex"><span className="size-1.5 rounded-full bg-acid" /> {saved ? 'Agent provisioned' : `Step ${step} of 3`}</span>
      </div>
      <div className="glass-panel p-5 lg:p-6">
        <div className="grid grid-cols-3 border border-white/10">
          {['Business context', 'Agent behavior', 'Number & launch'].map((label, index) => <div key={label} className={`flex h-12 items-center justify-center gap-2 border-r border-white/10 text-xs last:border-r-0 ${step === index + 1 ? 'bg-white/[0.08] text-white' : step > index + 1 ? 'text-acid' : 'text-white/35'}`}>{step > index + 1 ? <Check size={14} /> : <span className="font-mono">0{index + 1}</span>}<span className="hidden sm:inline">{label}</span></div>)}
        </div>
        {saved ? (
          <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center bg-acid text-ink"><Check size={22} /></span><h3 className="mt-4 font-semibold">{saved.agentName} is live</h3><p className="mt-2 text-sm text-white/40">Incoming calls route to {saved.twilioPhoneNumber} in {saved.language}.</p><button type="button" onClick={() => { setSaved(null); setStep(1); }} className="mt-6 border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/[0.05]">Create another agent</button></div>
        ) : step === 1 ? (
          <div className="grid gap-5 py-7 lg:grid-cols-2">
            <div><label className="block text-xs text-white/45" htmlFor="agent-name">Agent name</label><input id="agent-name" className="field mt-2" value={agentName} onChange={(event) => setAgentName(event.target.value)} /><label className="mt-5 block text-xs text-white/45" htmlFor="business-profile">Business profile</label><textarea id="business-profile" className="field mt-2 min-h-24 resize-none" value={businessProfile} onChange={(event) => setBusinessProfile(event.target.value)} /></div>
            <div><label className="block text-xs text-white/45" htmlFor="faqs">FAQs and support guidance</label><textarea id="faqs" className="field mt-2 min-h-24 resize-none" value={faqs} onChange={(event) => setFaqs(event.target.value)} /><label className="mt-5 block text-xs text-white/45" htmlFor="pricing">Pricing and offers</label><textarea id="pricing" className="field mt-2 min-h-20 resize-none" value={pricing} onChange={(event) => setPricing(event.target.value)} /></div>
          </div>
        ) : step === 2 ? (
          <div className="grid gap-6 py-7 lg:grid-cols-[1fr_0.8fr]"><div><label className="block text-xs text-white/45" htmlFor="system-prompt">Custom system prompt</label><textarea id="system-prompt" className="field mt-2 min-h-48 resize-none" value={systemPrompt} onChange={(event) => setSystemPrompt(event.target.value)} /><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="block text-xs text-white/45" htmlFor="language">Language</label><select id="language" className="field mt-2" value={language} onChange={(event) => setLanguage(event.target.value as AgentCreateInput['language'])}><option>English</option><option>Hindi</option><option>Hinglish</option></select></div><div><label className="block text-xs text-white/45" htmlFor="voice-style">Voice style</label><select id="voice-style" className="field mt-2" value={voice} onChange={(event) => setVoice(event.target.value)}>{voices.map((item) => <option key={item}>{item}</option>)}</select></div></div></div><div className="border-l border-white/10 pl-5"><div className="flex items-center gap-2 text-sm font-medium"><Mic2 size={17} className="text-sky" /> Voice preview</div><div className="mt-5 flex items-center gap-2 text-xs text-white/40"><Volume2 size={15} className="text-acid" /> {voice} · {language}</div><textarea aria-label="Voice preview text" className="field mt-3 min-h-24 resize-none" value={previewText} onChange={(event) => setPreviewText(event.target.value)} /><button type="button" onClick={previewVoice} className="mt-3 flex h-9 w-full items-center justify-center gap-2 border border-white/10 text-xs text-white/50 hover:bg-white/[0.04] hover:text-white"><Play size={13} fill="currentColor" /> Preview voice</button></div></div>
        ) : (
          <div className="py-7"><label className="block text-xs text-white/45" htmlFor="phone-number">Virtual phone number</label><select id="phone-number" className="field mt-2 max-w-md" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)}>{phoneNumbers.map((number) => <option key={number}>{number}</option>)}</select><div className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm"><div className="flex justify-between py-4"><span className="text-white/35">Agent</span><span>{agentName}</span></div><div className="flex justify-between py-4"><span className="text-white/35">Language</span><span>{language}</span></div><div className="flex justify-between py-4"><span className="text-white/35">Provisioning</span><span className="text-acid">Rs. 2,499 / month</span></div></div></div>
        )}
        {error && <p className="border border-rose/20 bg-rose/10 px-3 py-2 text-xs text-rose">{error}</p>}
        {!saved && <div className="flex justify-between border-t border-white/10 pt-5"><button type="button" disabled={step === 1 || saving} onClick={() => setStep((value) => value - 1)} className="flex h-10 items-center gap-1 px-2 text-sm text-white/45 disabled:opacity-20"><ChevronLeft size={15} /> Back</button><button type="button" disabled={!canContinue || saving} onClick={() => step < 3 ? setStep((value) => value + 1) : void openRazorpay()} className="flex h-10 items-center gap-2 bg-acid px-5 text-sm font-semibold text-ink hover:bg-white disabled:opacity-40">{saving ? <LoaderCircle size={15} className="animate-spin" /> : step === 3 ? <><CreditCard size={15} /> Pay and launch</> : <>Continue <ChevronRight size={15} /></>}</button></div>}
      </div>
    </section>
  );
}

interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; }
}
