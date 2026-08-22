'use client';

import type { Agent, CallLog } from '@/types/talkops';
import { useMemo, useState } from 'react';
import { Bot, CalendarDays, Flame, PhoneCall, Timer } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Range = '7 days' | '30 days';

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

export default function AnalyticsDashboard({ agents, logs }: { agents: Agent[]; logs: CallLog[] }) {
  const [range, setRange] = useState<Range>('7 days');
  const days = range === '7 days' ? 7 : 30;

  const visibleLogs = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - days + 1);
    return logs.filter((log) => new Date(log.createdAt) >= start);
  }, [days, logs]);

  const chartData = useMemo(() => {
    const counts = new Map<string, { calls: number; hotLeads: number }>();
    for (const log of visibleLogs) {
      const key = new Date(log.createdAt).toISOString().slice(0, 10);
      const current = counts.get(key) || { calls: 0, hotLeads: 0 };
      current.calls += 1;
      if (log.leadTemperature === 'Hot') current.hotLeads += 1;
      counts.set(key, current);
    }

    return Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - days + 1 + index);
      const key = date.toISOString().slice(0, 10);
      const count = counts.get(key) || { calls: 0, hotLeads: 0 };
      return {
        day: date.toLocaleDateString('en-IN', days === 7 ? { weekday: 'short' } : { day: 'numeric', month: 'short' }),
        ...count,
      };
    });
  }, [days, visibleLogs]);

  const totalDuration = visibleLogs.reduce((sum, log) => sum + log.duration, 0);
  const hotLeads = visibleLogs.filter((log) => log.leadTemperature === 'Hot').length;
  const metrics = [
    { label: 'Total calls', value: visibleLogs.length.toLocaleString('en-IN'), detail: `Last ${days} days`, icon: PhoneCall },
    { label: 'Active agents', value: agents.filter((agent) => agent.status === 'active').length.toLocaleString('en-IN'), detail: `${agents.length} provisioned`, icon: Bot },
    { label: 'Avg. duration', value: visibleLogs.length ? formatDuration(totalDuration / visibleLogs.length) : '0m 00s', detail: `${Math.round(totalDuration / 60).toLocaleString('en-IN')} minutes used`, icon: Timer },
    { label: 'Hot leads', value: hotLeads.toLocaleString('en-IN'), detail: visibleLogs.length ? `${Math.round((hotLeads / visibleLogs.length) * 100)}% of calls` : 'No calls yet', icon: Flame },
  ];

  return (
    <section aria-labelledby="analytics-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Performance</p>
          <h2 id="analytics-title" className="mt-2 text-xl font-semibold">Call analytics</h2>
        </div>
        <div className="flex border border-white/10 bg-black/20 p-1">
          {(['7 days', '30 days'] as Range[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`h-8 px-3 text-xs ${range === item ? 'bg-white text-ink' : 'text-white/45 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid border-l border-t border-white/10 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="border-b border-r border-white/10 bg-white/[0.025] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{metric.label}</span>
                <Icon size={16} className="text-white/30" />
              </div>
              <p className="metric-value mt-4">{metric.value}</p>
              <p className="mt-2 text-xs text-white/30">{metric.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel mt-5 p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Call volume and hot leads</p>
            <p className="mt-1 text-xs text-white/35">Live activity across your provisioned agents</p>
          </div>
          <CalendarDays size={17} className="text-white/30" />
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="callsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4db6ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4db6ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101216', border: '1px solid rgba(255,255,255,.12)', borderRadius: 0, fontSize: 12 }} />
              <Area type="monotone" dataKey="calls" stroke="#4db6ff" strokeWidth={2} fill="url(#callsFill)" />
              <Area type="monotone" dataKey="hotLeads" name="Hot leads" stroke="#d7ff45" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
