'use client';

import AgentConfigurator from '@/components/AgentConfigurator';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import CallLogTable from '@/components/CallLogTable';
import CampaignBuilder from '@/components/CampaignBuilder';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/api-client';
import type { Agent, CallLog } from '@/types/talkops';
import { Bell, Bot, ChevronDown, LoaderCircle, Menu, Plus, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const { firebaseUser, loading, openAuth, profile } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (!loading && !firebaseUser) openAuth('login');
  }, [firebaseUser, loading, openAuth]);

  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;

    void Promise.all([
      authenticatedFetch<Agent[]>(firebaseUser, '/api/agents'),
      authenticatedFetch<CallLog[]>(firebaseUser, '/api/call-logs?limit=100'),
    ])
      .then(([nextAgents, nextCalls]) => {
        if (cancelled) return;
        setAgents(nextAgents);
        setCalls(nextCalls);
      })
      .catch((fetchError) => {
        if (!cancelled) setDataError(fetchError instanceof Error ? fetchError.message : 'Unable to load workspace data.');
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => { cancelled = true; };
  }, [firebaseUser]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ink text-white/40"><LoaderCircle className="animate-spin" size={20} /></div>;
  if (!firebaseUser || !profile) return <div className="flex min-h-screen items-center justify-center bg-ink px-5 text-center text-sm text-white/45">Sign in to access your TalkOps workspace.</div>;

  return (
    <div className="min-h-screen bg-ink text-white">
      <Sidebar />
      <div className="lg:ml-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button type="button" className="icon-button lg:hidden" aria-label="Open navigation"><Menu size={18} /></button><div><p className="text-sm font-semibold">{profile.name || 'TalkOps workspace'}</p><p className="hidden text-[10px] text-white/30 sm:block">{profile.subscriptionPlan} plan</p></div><ChevronDown size={14} className="text-white/30" /></div>
          <div className="flex items-center gap-2"><span className="mr-2 hidden items-center gap-2 text-xs text-white/35 md:flex"><span className="size-1.5 rounded-full bg-acid" /> All systems operational</span><button type="button" className="icon-button" aria-label="Notifications"><Bell size={16} /></button><Link href="#agents" className="flex h-9 items-center gap-2 bg-acid px-3 text-xs font-semibold text-ink hover:bg-white"><Plus size={15} /> <span className="hidden sm:inline">New agent</span></Link></div>
        </header>
        <main className="mx-auto max-w-[1480px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Customer portal</p><h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Operations overview</h1><p className="mt-2 text-sm text-white/40">Monitor performance and keep every conversation moving.</p></div><div className="flex items-center gap-3 border-l-2 border-acid bg-acid/[0.05] px-4 py-3"><Zap size={17} className="text-acid" /><div><p className="text-xs font-medium">{profile.minutesBalance.toLocaleString('en-IN')} minutes remaining</p><p className="mt-0.5 text-[10px] text-white/30">{profile.subscriptionPlan} plan</p></div></div></div>
          {dataError && <p className="mb-5 border border-rose/20 bg-rose/10 px-4 py-3 text-xs text-rose">{dataError}</p>}
          <AnalyticsDashboard agents={agents} logs={calls} />
          <div className="my-10 grid gap-8 xl:grid-cols-2"><AgentConfigurator onCreated={(agent) => setAgents((current) => [agent, ...current])} /><CampaignBuilder /></div>
          <section id="agent-inventory" className="mb-10 scroll-mt-20" aria-labelledby="inventory-title">
            <div className="flex items-end justify-between"><div><p className="eyebrow">Provisioned infrastructure</p><h2 id="inventory-title" className="mt-2 text-xl font-semibold">Your live agents</h2></div>{dataLoading && <LoaderCircle size={17} className="animate-spin text-white/35" />}</div>
            {agents.length ? <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{agents.map((agent) => <article key={agent.id} className="border border-white/10 bg-white/[0.025] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{agent.agentName}</p><p className="mt-1 text-xs text-white/35">{agent.language} · {agent.voiceId}</p></div><span className={`px-2 py-1 text-[10px] font-semibold ${agent.status === 'active' ? 'bg-acid/10 text-acid' : 'bg-white/[0.07] text-white/45'}`}>{agent.status}</span></div><p className="mt-5 font-mono text-sm text-sky">{agent.twilioPhoneNumber}</p><p className="mt-2 text-xs text-white/30">Created {new Date(agent.createdAt).toLocaleDateString('en-IN')}</p></article>)}</div> : !dataLoading && <div className="mt-5 border border-dashed border-white/10 px-5 py-8 text-sm text-white/35">No agents provisioned yet. Use Agent Studio above to launch your first one.</div>}
          </section>
          <CallLogTable logs={calls} />
          <div className="mt-9 flex items-center gap-3 border border-white/10 bg-white/[0.025] p-4 text-xs text-white/35"><Bot size={16} className="text-sky" />Agent performance updates from your live call logs.</div>
        </main>
      </div>
    </div>
  );
}
