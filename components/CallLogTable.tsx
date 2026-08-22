'use client';

import { useAuth } from '@/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/api-client';
import type { CallLog } from '@/types/talkops';
import { Download, FileText, LoaderCircle, MoreHorizontal, Play, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const temperatureStyle: Record<string, string> = { Hot: 'bg-rose/10 text-rose', Warm: 'bg-sky/10 text-sky', Cold: 'bg-white/[0.07] text-white/55' };

function durationLabel(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }

export default function CallLogTable({ logs: initialLogs }: { logs?: CallLog[] }) {
  const { firebaseUser } = useAuth();
  const [calls, setCalls] = useState<CallLog[]>(initialLogs || []);
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);
  const [selected, setSelected] = useState<CallLog | null>(null);
  const [loading, setLoading] = useState(!initialLogs);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseUser || initialLogs) return;
    let cancelled = false;
    void authenticatedFetch<CallLog[]>(firebaseUser, '/api/call-logs?limit=100').then((data) => { if (!cancelled) setCalls(data); }).catch((fetchError) => { if (!cancelled) setError(fetchError instanceof Error ? fetchError.message : 'Unable to load calls.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [firebaseUser, initialLogs]);

  const filtered = useMemo(() => calls.filter((call) => `${call.callerNumber} ${call.agent?.agentName || ''} ${call.summary} ${call.leadTemperature}`.toLowerCase().includes(query.toLowerCase())), [calls, query]);

  function exportLogs() {
    const header = 'Caller,Agent,Duration,Lead temperature,Summary,Created at';
    const rows = calls.map((call) => [call.callerNumber, call.agent?.agentName || '', durationLabel(call.duration), call.leadTemperature, call.summary, call.createdAt].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','));
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'talkops-call-logs.csv'; anchor.click(); URL.revokeObjectURL(url);
  }

  return (
    <section id="calls" className="scroll-mt-20" aria-labelledby="calls-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Conversation history</p><h2 id="calls-title" className="mt-2 text-xl font-semibold">Recent calls</h2></div><button type="button" onClick={exportLogs} disabled={!calls.length} className="flex h-9 items-center justify-center gap-2 border border-white/10 px-3 text-xs text-white/50 hover:bg-white/[0.04] hover:text-white disabled:opacity-30"><Download size={14} /> Export</button></div>
      <div className="mt-5 overflow-hidden border border-white/10 bg-white/[0.025]"><div className="flex h-14 items-center border-b border-white/10 px-4"><Search size={15} className="text-white/30" /><input aria-label="Search calls" value={query} onChange={(event) => setQuery(event.target.value)} className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/25" placeholder="Search calls, agents, summaries..." /><span className="text-xs text-white/25">{filtered.length} records</span></div>{error && <p className="border-b border-rose/20 bg-rose/10 px-4 py-3 text-xs text-rose">{error}</p>}{loading ? <div className="flex min-h-52 items-center justify-center text-white/35"><LoaderCircle size={18} className="animate-spin" /></div> : <div className="thin-scrollbar overflow-x-auto"><table className="w-full min-w-[840px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30"><tr><th className="px-4 py-3 font-medium">Caller</th><th className="px-4 py-3 font-medium">Agent</th><th className="px-4 py-3 font-medium">Duration</th><th className="px-4 py-3 font-medium">Lead</th><th className="px-4 py-3 font-medium">Time</th><th className="w-24 px-4 py-3 font-medium">Details</th></tr></thead><tbody className="divide-y divide-white/5">{filtered.map((call) => <tr key={call.id} className="hover:bg-white/[0.025]"><td className="px-4 py-4"><p className="font-medium text-white/80">{call.callerNumber}</p><p className="mt-0.5 max-w-xs truncate text-xs text-white/30">{call.summary || 'No summary yet'}</p></td><td className="px-4 py-4 text-white/45">{call.agent?.agentName || 'TalkOps agent'}</td><td className="px-4 py-4 font-mono text-xs text-white/50">{durationLabel(call.duration)}</td><td className="px-4 py-4"><span className={`px-2 py-1 text-[10px] font-semibold ${temperatureStyle[call.leadTemperature]}`}>{call.leadTemperature}</span></td><td className="px-4 py-4 text-xs text-white/35">{new Date(call.createdAt).toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', day: '2-digit', month: 'short' })}</td><td className="px-4 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => setPlaying(playing === call.id ? null : call.id)} className={`icon-button size-8 ${playing === call.id ? 'border-acid/50 text-acid' : ''}`} aria-label="Play call audio"><Play size={13} fill="currentColor" /></button><button type="button" onClick={() => setSelected(call)} className="icon-button size-8" aria-label="View transcript and summary"><FileText size={14} /></button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="py-10 text-center text-sm text-white/35">{calls.length ? 'No calls match your search.' : 'No calls have been received yet.'}</p>}</div>}</div>
      {selected && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><button type="button" className="absolute inset-0" onClick={() => setSelected(null)} aria-label="Close call details" /><div className="glass-panel relative z-10 w-full max-w-2xl p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Call intelligence</p><h3 className="mt-2 text-lg font-semibold">{selected.callerNumber}</h3></div><button type="button" className="icon-button" onClick={() => setSelected(null)} aria-label="Close"><MoreHorizontal size={16} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div><p className="eyebrow">Agent</p><p className="mt-2 text-sm">{selected.agent?.agentName || 'TalkOps agent'}</p></div><div><p className="eyebrow">Duration</p><p className="mt-2 font-mono text-sm">{durationLabel(selected.duration)}</p></div><div><p className="eyebrow">Lead</p><p className="mt-2 text-sm">{selected.leadTemperature}</p></div></div><div className="mt-6 border-t border-white/10 pt-5"><p className="eyebrow">Summary</p><p className="mt-2 text-sm leading-6 text-white/65">{selected.summary || 'No summary available.'}</p><p className="eyebrow mt-6">Transcript</p><p className="mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-white/45">{selected.transcript || 'No transcript available.'}</p></div></div></div>}
    </section>
  );
}
