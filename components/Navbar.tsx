'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, AudioLines, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/#solutions', label: 'Solutions' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#industries', label: 'Industries' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { firebaseUser, openAuth, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const isLanding = pathname === '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="TalkOps home">
          <span className="flex size-8 items-center justify-center bg-acid text-ink">
            <AudioLines size={18} strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-bold text-white">TalkOps</span>
        </Link>

        {isLanding && (
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-white/55 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {firebaseUser ? (
            <>
              <Link href={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="inline-flex h-9 items-center gap-2 px-3 text-sm text-white/60 hover:text-white">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <button type="button" onClick={() => void signOut()} className="icon-button" aria-label="Log out" title="Log out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button type="button" onClick={() => openAuth('login')} className="inline-flex h-9 items-center gap-2 px-3 text-sm text-white/60 hover:text-white">
              <LogIn size={15} /> Log in
            </button>
          )}
          <a
            href="https://wa.me/917517420170"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 bg-white px-4 text-sm font-semibold text-ink hover:bg-acid"
          >
            Chat on WhatsApp <ArrowUpRight size={15} />
          </a>
        </div>

        <button
          type="button"
          className="icon-button md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm text-white/70"
              >
                {link.label}
              </Link>
            ))}
            {firebaseUser ? (
              <Link href={profile?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="mt-3 flex h-10 items-center justify-center gap-2 border border-white/10 text-sm font-semibold text-white">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            ) : (
              <button type="button" onClick={() => { setOpen(false); openAuth('login'); }} className="mt-3 flex h-10 items-center justify-center gap-2 border border-white/10 text-sm font-semibold text-white">
                <LogIn size={15} /> Log in
              </button>
            )}
            <a
              href="https://wa.me/917517420170"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-10 items-center justify-center bg-acid text-sm font-semibold text-ink"
            >
              Get Started on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
