import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Languages, MessageCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';

const solutions = {
  'ai-call-receiving-sales-agent.html': {
    eyebrow: 'Inbound AI voice',
    title: 'AI Call-Receiving Sales Agent',
    description: 'Answer every inbound sales enquiry with a consistent, multilingual AI agent that can explain your offering, share approved pricing ranges, and qualify the opportunity.',
    highlights: ['24/7 incoming call coverage', 'English, Hindi, and Hinglish conversations', 'Hot, Warm, and Cold lead qualification', 'Call transcript, summary, and next steps'],
    workflow: ['Add your business profile, FAQs, pricing, and sales guidance.', 'Choose the preferred language, voice, and virtual number.', 'Review call intelligence and follow up with qualified leads.'],
  },
  'bulk-whatsapp-sms-automation.html': {
    eyebrow: 'Messaging automation',
    title: 'Bulk WhatsApp & SMS Automation',
    description: 'Run structured outreach for existing and consented contacts with personalized messaging, scheduled execution, and a clear campaign handoff.',
    highlights: ['CSV and Excel contact upload', 'Personalized WhatsApp and SMS campaigns', 'Interakt and AiSensy workflow handoff', 'Contact counting and campaign records'],
    workflow: ['Upload a CSV, XLS, or XLSX contact list.', 'Prepare the campaign name and approved message.', 'Choose your messaging partner and continue to launch.'],
  },
  'ai-outbound-calling.html': {
    eyebrow: 'Consent-based outreach',
    title: 'AI Script-Based Outbound Calling',
    description: 'Deliver short, controlled voice reminders and announcements to existing customers or consent-based lists using an approved script and measurable workflow.',
    highlights: ['Focused 20-30 second call scripts', 'Reminder and announcement use cases', 'Multilingual voice configuration', 'Consent-first operating model'],
    workflow: ['Define the audience, consent basis, and campaign objective.', 'Approve the script, language, voice, and escalation rules.', 'Launch in controlled batches and review call outcomes.'],
  },
} as const;

type SolutionSlug = keyof typeof solutions;

export function generateStaticParams() {
  return Object.keys(solutions).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions[slug as SolutionSlug];
  return solution ? { title: solution.title, description: solution.description } : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutions[slug as SolutionSlug];
  if (!solution) notFound();

  return (
    <main className="min-h-screen bg-ink text-white">
      <Navbar />
      <section className="grid-surface border-b border-white/10 pt-16">
        <div className="mx-auto flex min-h-[650px] max-w-[1440px] flex-col justify-center px-5 py-20 lg:px-8">
          <Link href="/#solutions" className="mb-10 inline-flex w-fit items-center gap-2 text-xs text-white/45 hover:text-white"><ArrowLeft size={14} /> All solutions</Link>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow text-acid">{solution.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{solution.title}</h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">{solution.description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="https://wa.me/917517420170" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-acid px-5 text-sm font-semibold text-ink hover:bg-white"><MessageCircle size={17} /> Discuss this solution</a>
                <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 border border-white/15 px-5 text-sm font-semibold text-white hover:bg-white/[0.06]">Open workspace <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="border-y border-white/10 bg-white/[0.02]">
              {solution.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-sm text-white/65 last:border-b-0"><Check size={15} className="shrink-0 text-acid" /> {highlight}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0c0e] py-20">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div><p className="eyebrow text-sky">Implementation</p><h2 className="mt-4 text-3xl font-semibold">A controlled path to launch.</h2></div>
            <ol className="border-y border-white/10">
              {solution.workflow.map((item, index) => <li key={item} className="grid gap-3 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[60px_1fr] sm:items-center"><span className="font-mono text-xs text-acid">0{index + 1}</span><p className="text-sm leading-6 text-white/60">{item}</p></li>)}
            </ol>
          </div>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-3">
            <div className="bg-ink p-6"><PhoneCall size={18} className="text-acid" /><p className="mt-5 text-sm font-medium">Operational visibility</p><p className="mt-2 text-xs leading-5 text-white/35">Review activity and outcomes from the TalkOps workspace.</p></div>
            <div className="bg-ink p-6"><Languages size={18} className="text-sky" /><p className="mt-5 text-sm font-medium">India-ready language</p><p className="mt-2 text-xs leading-5 text-white/35">Configure English, Hindi, or Hinglish communication.</p></div>
            <div className="bg-ink p-6"><ShieldCheck size={18} className="text-rose" /><p className="mt-5 text-sm font-medium">Controlled communication</p><p className="mt-2 text-xs leading-5 text-white/35">Use approved context, scripts, and consent-based audiences.</p></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/30">TalkOps · +91 7517420170 · AI-powered customer communication for Indian businesses</footer>
    </main>
  );
}
