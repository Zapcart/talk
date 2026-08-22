'use client';

import { authenticatedFetch } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminDashboardData, TalkOpsUser } from '@/types/talkops';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  LoaderCircle,
  Menu,
  PhoneCall,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CallLogTable from '@/components/CallLogTable';
import Sidebar from '@/components/Sidebar';

const services = [
  { name: 'Voice gateway', region: 'Global edge', load: 42, latency: '86ms' },
  { name: 'Agent runtime', region: 'us-east-1', load: 67, latency: '124ms' },
  { name: 'Transcription', region: 'Multi-region', load: 51, latency: '318ms' },
  { name: 'Event pipeline', region: 'us-central-1', load: 29, latency: '41ms' },
];

function initials(user: TalkOpsUser) {
  return (user.name || user.email || 'U').slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
}

export default function AdminDashboard() {
  const { firebaseUser, loading: authLoading, openAuth, profile } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUser, setSavingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !firebaseUser) openAuth('login');
  }, [authLoading, firebaseUser, openAuth]);

  useEffect(() => {
    if (!firebaseUser || profile?.role !== 'admin') return;
    let cancelled = false;
    void authenticatedFetch<AdminDashboardData>(firebaseUser, '/api/admin/stats')
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((fetchError) => {
        if (!cancelled) setError(fetchError instanceof Error ? fetchError.message : 'Unable to load admin data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser, profile?.role]);

  async function updateUser(user: TalkOpsUser, patch: Partial<Pick<TalkOpsUser, 'subscriptionPlan' | 'minutesBalance' | 'status' | 'isPaid'>>) {
    if (!firebaseUser) return;
    setSavingUser(user.id);
    setError('');
    try {
      const updated = await authenticatedFetch<TalkOpsUser>(firebaseUser, `/api/admin/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      setData((current) => current ? { ...current, users: current.users.map((item) => item.id === updated.id ? updated : item) } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update the user.');
    } finally {
      setSavingUser(null);
    }
  }

  if (authLoading || (profile?.role === 'admin' && loading)) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-white/40"><LoaderCircle className="animate-spin" size={20} /></div>;
  }
  if (!firebaseUser || !profile) {
    return <div className="flex min-h-screen items-center justify-center bg-ink px-5 text-center text-sm text-white/45">Sign in to access the TalkOps control center.</div>;
  }
  if (profile.role !== 'admin') {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-5 text-center text-sm text-white/45"><ShieldCheck size={28} className="text-rose" />This account does not have administrator access.<Link href="/dashboard" className="text-acid hover:text-white">Return to workspace</Link></div>;
  }

  const stats = data?.stats;
  const metrics = [
    { label: 'Total users', value: stats?.totalUsers.toLocaleString('en-IN') || '0', detail: 'Synchronized profiles', icon: Building2, accent: 'text-acid' },
    { label: 'Active agents', value: stats?.activeAgents.toLocaleString('en-IN') || '0', detail: 'Provisioned and live', icon: PhoneCall, accent: 'text-sky' },
    { label: 'Consumed call minutes', value: stats?.callMinutesConsumed.toLocaleString('en-IN') || '0', detail: 'Across all customers', icon: CircleDollarSign, accent: 'text-acid' },
    { label: 'Paid users', value: stats?.paidUsers.toLocaleString('en-IN') || '0', detail: `Rs. ${(stats?.estimatedRevenue || 0).toLocaleString('en-IN')} estimated`, icon: Users, accent: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-ink text-white">
      <Sidebar admin />
      <div className="lg:ml-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button type="button" className="icon-button lg:hidden" aria-label="Open navigation"><Menu size={18} /></button><ShieldCheck size={18} className="text-acid" /><div><p className="text-sm font-semibold">Admin control center</p><p className="hidden text-[10px] text-white/30 sm:block">TalkOps production</p></div></div>
          <div className="flex items-center gap-2"><Link href="/dashboard" className="hidden h-9 items-center gap-2 px-3 text-xs text-white/45 hover:text-white sm:flex">Customer view <ArrowUpRight size={14} /></Link><button type="button" className="icon-button" aria-label="Admin notifications"><Bell size={16} /></button><span className="flex size-9 items-center justify-center bg-sky text-xs font-bold text-ink">{initials(profile)}</span></div>
        </header>
        <main className="mx-auto max-w-[1480px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mb-8"><p className="eyebrow">Platform administration</p><h1 className="mt-2 text-2xl font-semibold sm:text-3xl">System at a glance</h1><p className="mt-2 text-sm text-white/40">Monitor customers, infrastructure, usage, and revenue.</p></div>
          {error && <p className="mb-6 border border-rose/20 bg-rose/10 px-4 py-3 text-xs text-rose">{error}</p>}
          <section aria-label="Platform metrics" className="grid border-l border-t border-white/10 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <div key={metric.label} className="border-b border-r border-white/10 bg-white/[0.025] p-5"><div className="flex items-center justify-between"><span className="text-xs text-white/40">{metric.label}</span><Icon size={17} className={metric.accent} /></div><p className="metric-value mt-5">{metric.value}</p><p className="mt-2 text-xs text-white/30">{metric.detail}</p></div>; })}</section>
          <div id="health" className="mt-7 grid scroll-mt-20 gap-7 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="glass-panel p-5 lg:p-6" aria-labelledby="infra-title"><div className="flex items-center justify-between"><div><p className="eyebrow">Live infrastructure</p><h2 id="infra-title" className="mt-2 text-lg font-semibold">Service health</h2></div><span className="flex items-center gap-2 text-xs text-acid"><CheckCircle2 size={15} /> All systems nominal</span></div><div className="mt-6 divide-y divide-white/10 border-y border-white/10">{services.map((service) => <div key={service.name} className="grid items-center gap-3 py-4 sm:grid-cols-[1fr_0.7fr_1fr_70px]"><span className="flex items-center gap-2 text-sm"><Server size={14} className="text-white/30" />{service.name}</span><span className="text-xs text-white/30">{service.region}</span><div className="flex items-center gap-3"><div className="h-1 flex-1 bg-white/10"><div className="h-full bg-acid" style={{ width: `${service.load}%` }} /></div><span className="w-8 text-right font-mono text-[10px] text-white/35">{service.load}%</span></div><span className="text-right font-mono text-xs text-white/45">{service.latency}</span></div>)}</div></section>
            <section className="glass-panel p-5 lg:p-6" aria-labelledby="events-title"><div className="flex items-center justify-between"><div><p className="eyebrow">Live counters</p><h2 id="events-title" className="mt-2 text-lg font-semibold">Platform activity</h2></div><Activity size={17} className="text-white/30" /></div><div className="mt-6 space-y-5 text-sm text-white/60"><p className="flex items-center justify-between border-b border-white/10 pb-4"><span>Triggered campaigns</span><strong className="text-white">{stats?.campaignsTriggered || 0}</strong></p><p className="flex items-center justify-between border-b border-white/10 pb-4"><span>Affiliate redirects</span><strong className="text-white">{stats?.affiliateRedirections || 0}</strong></p><p className="flex items-center justify-between"><span>Call minutes consumed</span><strong className="text-white">{stats?.callMinutesConsumed || 0}</strong></p></div></section>
          </div>
          <section className="mt-7" aria-labelledby="workspace-title"><div className="flex items-end justify-between"><div><p className="eyebrow">Customer operations</p><h2 id="workspace-title" className="mt-2 text-xl font-semibold">User management</h2></div><span className="text-xs text-white/40">{data?.users.length || 0} shown</span></div><div className="mt-5 overflow-x-auto border border-white/10 bg-white/[0.025]"><table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30"><tr><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Minutes</th><th className="px-4 py-3 font-medium">Paid</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Joined</th><th className="w-12 px-4 py-3" /></tr></thead><tbody className="divide-y divide-white/5">{data?.users.map((user) => <tr key={user.id} className="hover:bg-white/[0.025]"><td className="px-4 py-4"><p className="font-medium text-white/75">{user.name || 'Unnamed user'}</p><p className="mt-0.5 text-xs text-white/30">{user.email}</p></td><td className="px-4 py-4"><select aria-label={`Plan for ${user.email}`} value={user.subscriptionPlan} disabled={savingUser === user.id} onChange={(event) => void updateUser(user, { subscriptionPlan: event.target.value })} className="border border-white/10 bg-ink px-2 py-1 text-xs text-white/60"><option>starter</option><option>growth</option><option>scale</option><option>enterprise</option></select></td><td className="px-4 py-4"><input aria-label={`Minutes for ${user.email}`} type="number" min="0" defaultValue={user.minutesBalance} disabled={savingUser === user.id} onBlur={(event) => { const next = Number(event.target.value); if (next !== user.minutesBalance) void updateUser(user, { minutesBalance: next }); }} className="w-24 border border-white/10 bg-ink px-2 py-1 font-mono text-xs text-white/60" /></td><td className="px-4 py-4"><button type="button" disabled={savingUser === user.id} onClick={() => void updateUser(user, { isPaid: !user.isPaid })} className={user.isPaid ? 'text-acid' : 'text-white/30'}>{user.isPaid ? 'Paid' : 'Unpaid'}</button></td><td className="px-4 py-4"><button type="button" disabled={savingUser === user.id || user.id === profile.id} onClick={() => void updateUser(user, { status: user.status === 'active' ? 'disabled' : 'active' })} className={`inline-flex items-center gap-1.5 text-xs ${user.status === 'active' ? 'text-acid' : 'text-rose'}`}>{user.status === 'active' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}{user.status}</button></td><td className="px-4 py-4 text-xs text-white/35">{formatDate(user.createdAt)}</td><td className="px-4 py-4">{savingUser === user.id && <LoaderCircle size={14} className="animate-spin text-sky" />}</td></tr>)}</tbody></table>{!data?.users.length && <p className="p-8 text-center text-sm text-white/35">No synchronized users yet.</p>}</div></section>
          <div className="mt-9"><CallLogTable logs={data?.callLogs || []} /></div>
          <section id="settings" className="mt-7 grid scroll-mt-20 gap-4 md:grid-cols-3" aria-label="Platform controls">{[{ title: 'Global call limits', text: 'Manage concurrency and regional routing.', icon: Activity }, { title: 'Security policies', text: 'Configure retention and access controls.', icon: ShieldCheck }, { title: 'Billing operations', text: 'Review collections, credits, and invoices.', icon: CircleDollarSign }].map((item) => { const Icon = item.icon; return <button key={item.title} type="button" className="flex items-center gap-4 border border-white/10 bg-white/[0.025] p-5 text-left hover:border-white/20 hover:bg-white/[0.05]"><span className="flex size-9 shrink-0 items-center justify-center bg-white/[0.06]"><Icon size={17} className="text-acid" /></span><span className="min-w-0"><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs leading-5 text-white/30">{item.text}</span></span><ChevronRight size={15} className="ml-auto shrink-0 text-white/20" /></button>; })}</section>
        </main>
      </div>
    </div>
  );
}
