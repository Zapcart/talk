'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  AudioLines,
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Megaphone,
  PhoneCall,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

const portalLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard#agents', label: 'Agents', icon: Bot },
  { href: '/dashboard#campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/dashboard#calls', label: 'Call logs', icon: PhoneCall },
];

const adminLinks = [
  { href: '/admin', label: 'Control center', icon: ShieldCheck },
  { href: '/admin#health', label: 'System health', icon: Activity },
  { href: '/admin#settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ admin = false }: { admin?: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const links = admin ? adminLinks : portalLinks;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#0b0c0f] lg:flex lg:flex-col ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden" aria-label="TalkOps home">
          <span className="flex size-8 shrink-0 items-center justify-center bg-acid text-ink">
            <AudioLines size={18} strokeWidth={2.5} />
          </span>
          {!collapsed && <span className="whitespace-nowrap text-[15px] font-bold text-white">TalkOps</span>}
        </Link>
      </div>

      <div className="flex-1 px-3 py-5">
        {!collapsed && <p className="eyebrow px-2 pb-3">{admin ? 'Administration' : 'Workspace'}</p>}
        <nav className="space-y-1" aria-label={admin ? 'Admin navigation' : 'Dashboard navigation'}>
          {links.map((link, index) => {
            const Icon = link.icon;
            const active = index === 0 && (pathname === '/admin' || pathname === '/admin/dashboard' || pathname === link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.label : undefined}
                className={`flex h-10 items-center gap-3 px-2.5 text-sm ${
                  active ? 'bg-white/[0.08] text-white' : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80'
                }`}
              >
                <Icon size={17} className={active ? 'text-acid' : ''} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/#support"
          className="flex h-10 items-center gap-3 px-2.5 text-sm text-white/45 hover:bg-white/[0.04] hover:text-white"
        >
          <CircleHelp size={17} />
          {!collapsed && <span>Support</span>}
        </Link>
        <button
          type="button"
          className="mt-1 flex h-10 w-full items-center gap-3 px-2.5 text-sm text-white/45 hover:bg-white/[0.04] hover:text-white"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
