import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  AudioLines,
  Bot,
  Check,
  ChevronRight,
  FileText,
  Flame,
  Languages,
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const siteTitle = 'TalkOps | Free AI Video Generator, AI Voice & WhatsApp Automation';
const siteDescription =
  'Generate stunning high-quality AI videos for free from text prompts using TalkOps. Unlimited AI video generation tool powered by TalkOps.';

export const metadata: Metadata = {
  title: { absolute: siteTitle },
  description: siteDescription,
};

const solutions = [
  {
    number: '01',
    icon: PhoneCall,
    accent: 'text-acid',
    title: 'AI Call-Receiving Sales Agent (Inbound)',
    description:
      'Answers incoming calls 24/7, explains offerings, shares pricing ranges, qualifies leads, and sends call summaries to WhatsApp or dashboard.',
    features: [
      'Consistent sales messaging',
      'Hot/Warm/Cold qualification',
      'WhatsApp summary after each call',
    ],
    href: '/solutions/ai-call-receiving-sales-agent.html',
  },
  {
    number: '02',
    icon: MessageSquareText,
    accent: 'text-sky',
    title: 'Bulk WhatsApp & SMS Automation',
    description:
      'Send high-volume WhatsApp and SMS campaigns with personalization, scheduling, and reporting without compromising brand consistency.',
    features: [
      'Personalized campaigns',
      'Scheduling and reporting',
      'WhatsApp + SMS support',
    ],
    href: '/solutions/bulk-whatsapp-sms-automation.html',
  },
  {
    number: '03',
    icon: Bot,
    accent: 'text-rose',
    title: 'AI Script-Based Outbound Calling',
    description:
      'Run short 20–30 second AI calls for reminders and announcements to existing customers or consent-based lists.',
    features: [],
    disclaimer: 'Outbound AI calls are made only with prior customer consent.',
    href: '/solutions/ai-outbound-calling.html',
  },
];

const process = [
  'Share business context, pricing ranges, and preferred language.',
  'Choose the module(s) and success criteria for qualification.',
  'Go live, review summaries, and continuously improve outcomes.',
];

const values = [
  {
    icon: Workflow,
    title: 'Enterprise Messaging Quality',
    description:
      'Structured flows with controlled negotiation, product-specific answers, and consistent language.',
  },
  {
    icon: Target,
    title: 'Actionable Lead Intelligence',
    description:
      'Hot/Warm/Cold qualification with clear next steps and WhatsApp summaries.',
  },
  {
    icon: ShieldCheck,
    title: 'Consent-First Outbound Calling',
    description:
      'Executed only with prior customer consent, aligned with responsible communication.',
  },
];

const whatsappUrl = 'https://wa.me/917517420170';

export default function Home() {
  return (
    <main className="overflow-hidden bg-ink text-white">
      <Navbar />

      <section className="grid-surface relative border-b border-white/10 pt-16">
        <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-14 px-5 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="relative z-10 max-w-3xl">
            <section className="mb-8 border-l-2 border-acid bg-white/[0.035] px-5 py-4" aria-labelledby="free-ai-video-generator-title">
              <p className="eyebrow text-acid">Free AI Video Generator</p>
              <h2 id="free-ai-video-generator-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Turn text prompts into high-quality AI videos
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Generate stunning videos for free with TalkOps, then pair them with AI voice and WhatsApp automation for faster customer communication.
              </p>
              <a href="#contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-acid hover:text-white">
                Start generating free <ArrowRight size={16} />
              </a>
            </section>
            <div className="mb-7 inline-flex items-center gap-2 border border-acid/25 bg-acid/[0.06] px-3 py-1.5 text-xs font-medium text-acid">
              <Sparkles size={13} />
              AI-powered customer communication for Indian businesses
            </div>
            <h1 className="max-w-[16ch] text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-[64px]">
              Convert more leads with a 24/7 AI voice sales agent and enterprise-grade WhatsApp automation
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
              Handle incoming calls instantly, qualify leads, share pricing ranges, and send summaries to WhatsApp. Add bulk WhatsApp & SMS automation and consent-based outbound AI calling when you scale.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 bg-acid px-5 text-sm font-semibold text-ink hover:bg-white"
              >
                <MessageCircle size={17} /> Get Started on WhatsApp
              </a>
              <a
                href="#solutions"
                className="inline-flex h-12 items-center justify-center gap-2 border border-white/15 bg-white/[0.03] px-5 text-sm font-semibold text-white hover:bg-white/[0.08]"
              >
                Explore Solutions <ArrowRight size={17} />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">
              <span className="flex items-center gap-2"><Languages size={14} className="text-sky" /> English, Hindi, Hinglish</span>
              <span className="flex items-center gap-2"><PhoneCall size={14} className="text-acid" /> +91 7517420170</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-10 bg-sky/[0.06] blur-3xl" />
            <div className="glass-panel relative overflow-hidden shadow-2xl shadow-black/50">
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <span className="size-2 rounded-full bg-acid" /> AI sales agent live
                </div>
                <span className="flex items-center gap-2 text-xs text-white/35"><Languages size={14} /> Hinglish</span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="eyebrow">Incoming call</p>
                    <h2 className="mt-2 text-xl font-semibold">New sales enquiry</h2>
                    <p className="mt-1 text-sm text-white/35">Connected for 02:18</p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center bg-acid text-ink"><PhoneCall size={18} /></span>
                </div>

                <div className="my-8 flex h-16 items-center justify-center gap-1 border-y border-white/5 bg-black/10 px-2" aria-label="Active call waveform">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <span
                      key={index}
                      className="wave-bar w-1 rounded-full bg-acid"
                      style={{ height: `${16 + ((index * 17) % 38)}px`, animationDelay: `${index * 35}ms` }}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-white/40"><Flame size={14} className="text-rose" /> Lead qualification</span>
                      <span className="bg-rose/10 px-2 py-1 text-[10px] font-semibold text-rose">HOT</span>
                    </div>
                    <p className="mt-3 text-sm text-white/70">Interested in Professional Plan. Ready for a product demo this week.</p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40"><Send size={14} className="text-sky" /> Real-time WhatsApp call summaries</div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-acid"><Check size={14} /> Summary delivered to sales team</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-white/10 bg-black/15">
                <div className="border-r border-white/10 p-4"><p className="text-[10px] uppercase tracking-widest text-white/30">Response</p><p className="mt-2 text-lg font-semibold">Instant</p></div>
                <div className="p-4"><p className="text-[10px] uppercase tracking-widest text-white/30">Availability</p><p className="mt-2 text-lg font-semibold text-acid">24/7</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0c0e]" aria-label="Key metrics and highlights">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 lg:grid-cols-5 lg:px-8">
          {[
            ['24/7', 'Call Answering Availability'],
            ['₹3,999', 'Starter Plan / month'],
            ['700', 'Professional Plan minutes included'],
            ['Hot / Warm / Cold', 'Lead Qualification'],
            ['Real-time', 'WhatsApp call summaries'],
          ].map(([value, label]) => (
            <div key={label} className="border-b border-r border-white/10 px-4 py-7 first:border-l lg:border-b-0">
              <p className="text-lg font-semibold text-white sm:text-xl">{value}</p>
              <p className="mt-2 max-w-[18ch] text-xs leading-5 text-white/35">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="scroll-mt-16 border-b border-white/10 py-24">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="eyebrow text-acid">Core solutions</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">AI-Powered Customer Communication Solutions</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/45 lg:justify-self-end">
              Enterprise-grade customer conversations for Indian businesses, from the first inbound call to multi-channel follow-up.
            </p>
          </div>

          <div className="mt-14 grid border-l border-t border-white/10 xl:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <article key={solution.title} className="flex min-h-[440px] flex-col border-b border-r border-white/10 bg-white/[0.018] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <Icon size={24} className={solution.accent} />
                    <span className="font-mono text-xs text-white/20">{solution.number}</span>
                  </div>
                  <h3 className="mt-10 max-w-[20ch] text-xl font-semibold leading-7">{solution.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/45">{solution.description}</p>
                  {solution.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-white/60"><Check size={14} className={solution.accent} /> {feature}</li>
                      ))}
                    </ul>
                  )}
                  {solution.disclaimer && (
                    <p className="mt-6 border-l-2 border-rose/60 pl-3 text-xs leading-5 text-white/40">{solution.disclaimer}</p>
                  )}
                  <Link href={solution.href} className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-medium text-white/65 hover:text-acid">
                    Explore solution <ChevronRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-16 border-b border-white/10 bg-[#0b0c0e] py-24">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow text-sky">How It Works</p>
              <h2 className="mt-4 max-w-md text-3xl font-semibold sm:text-4xl">Go from business context to better conversations.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">A focused three-step process built around your offer, audience, and success criteria.</p>
            </div>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {process.map((description, index) => (
                <li key={description} className="grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:items-center">
                  <span className="font-mono text-xs text-acid">0{index + 1}</span>
                  <p className="text-base leading-7 text-white/70">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-16 border-b border-white/10 py-24">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-acid">Value & trust</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">Enterprise quality. Actionable outcomes.</h2>
          </div>
          <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="bg-ink p-7 lg:p-9">
                  <span className="flex size-10 items-center justify-center border border-white/10 bg-white/[0.04]"><Icon size={19} className="text-acid" /></span>
                  <h3 className="mt-10 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">{value.description}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-12 grid gap-4 border border-white/10 bg-white/[0.025] p-6 sm:grid-cols-3 lg:p-8">
            <div className="flex items-center gap-3"><Users size={19} className="text-sky" /><div><p className="text-sm font-medium">Built for Indian Businesses</p><p className="mt-1 text-xs text-white/30">Sales, service, and operations teams</p></div></div>
            <div className="flex items-center gap-3"><Languages size={19} className="text-acid" /><div><p className="text-sm font-medium">English, Hindi, Hinglish</p><p className="mt-1 text-xs text-white/30">Natural language support</p></div></div>
            <div className="flex items-center gap-3"><FileText size={19} className="text-rose" /><div><p className="text-sm font-medium">Controlled communication</p><p className="mt-1 text-xs text-white/30">Consistent and reviewable flows</p></div></div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-16 py-24">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
          <div className="grid items-center gap-10 border border-white/10 bg-white/[0.025] p-7 md:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="eyebrow text-acid">Talk to TalkOps</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">Start handling every customer conversation with clarity.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">Enterprise-grade customer conversations / AI-Powered Customer Communication Solutions</p>
            </div>
            <div className="md:text-right">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 bg-acid px-5 text-sm font-semibold text-ink hover:bg-white"
              >
                <MessageCircle size={17} /> Get Started on WhatsApp
              </a>
              <a href="tel:+917517420170" className="mt-3 block text-sm text-white/45 hover:text-white">+91 7517420170</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0b0c0e]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="TalkOps home">
              <span className="flex size-8 items-center justify-center bg-acid text-ink"><AudioLines size={18} strokeWidth={2.5} /></span>
              <span className="text-[15px] font-bold">TalkOps</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/35">Enterprise-grade customer conversations for Indian Businesses.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-acid"><MessageCircle size={15} /> +91 7517420170</a>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">Solutions</p>
            <div className="mt-4 flex flex-col gap-3 text-xs text-white/35">
              <Link href="/solutions/ai-call-receiving-sales-agent.html">AI Call-Receiving Sales Agent</Link>
              <Link href="/solutions/bulk-whatsapp-sms-automation.html">Bulk WhatsApp & SMS Automation</Link>
              <Link href="/solutions/ai-outbound-calling.html">AI Outbound Calling</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-xs text-white/35"><a href="#how-it-works">How It Works</a><a href="#industries">Industries</a><a href="#contact">Contact</a></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">Legal</p>
            <div className="mt-4 flex flex-col gap-3 text-xs text-white/35"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms & Conditions</Link></div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 text-[10px] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <span>© 2026 TalkOps. All rights reserved.</span>
            <span>AI-Powered Customer Communication Solutions</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
