'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowRight, AudioLines, LoaderCircle, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

function readableAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Authentication failed.';
  if (message.includes('auth/invalid-credential')) return 'The email or password is incorrect.';
  if (message.includes('auth/email-already-in-use')) return 'An account already exists for this email.';
  if (message.includes('auth/weak-password')) return 'Use a password with at least 6 characters.';
  if (message.includes('auth/popup-closed-by-user')) return 'Google sign-in was cancelled.';
  return message;
}

export default function AuthModal() {
  const {
    authModalOpen,
    authMode,
    closeAuth,
    configured,
    openAuth,
    resetPassword,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
  } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!authModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && closeAuth();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [authModalOpen, closeAuth]);

  if (!authModalOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      if (authMode === 'signup') await signUpWithEmail(name.trim(), email.trim(), password);
      else await signInWithEmail(email.trim(), password);
    } catch (submitError) {
      setError(readableAuthError(submitError));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setPending(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (googleError) {
      setError(readableAuthError(googleError));
    } finally {
      setPending(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError('Enter your email first, then select reset password.');
      return;
    }
    setPending(true);
    setError('');
    try {
      await resetPassword(email.trim());
      setNotice('Password reset email sent.');
    } catch (resetError) {
      setError(readableAuthError(resetError));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" className="absolute inset-0 cursor-default" onClick={closeAuth} aria-label="Close authentication modal" />
      <section className="glass-panel relative z-10 w-full max-w-md overflow-hidden shadow-2xl shadow-black/60">
        <div className="h-1 bg-gradient-to-r from-acid via-sky to-rose" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="mb-5 flex size-10 items-center justify-center bg-acid text-ink"><AudioLines size={20} /></span>
              <p className="eyebrow">Secure TalkOps access</p>
              <h2 id="auth-title" className="mt-2 text-2xl font-semibold text-white">{authMode === 'signup' ? 'Create your workspace' : 'Welcome back'}</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">{authMode === 'signup' ? 'Launch your AI communication operation in minutes.' : 'Continue to your agents, campaigns, and call intelligence.'}</p>
            </div>
            <button type="button" className="icon-button" onClick={closeAuth} aria-label="Close"><X size={17} /></button>
          </div>

          {!configured && (
            <div className="mt-6 flex gap-3 border border-rose/25 bg-rose/10 p-3 text-xs leading-5 text-rose">
              <AlertCircle className="mt-0.5 shrink-0" size={15} />
              Firebase is not configured yet. Add the values from .env.example to .env.local.
            </div>
          )}

          <form className="mt-7 space-y-3" onSubmit={handleSubmit}>
            {authMode === 'signup' && (
              <label className="relative block">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                <input className="field pl-10" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" autoComplete="name" required />
              </label>
            )}
            <label className="relative block">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
              <input className="field pl-10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" autoComplete="email" required />
            </label>
            <label className="relative block">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
              <input className="field pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required />
            </label>

            {authMode === 'login' && (
              <button type="button" className="text-xs text-white/40 hover:text-acid" onClick={handleReset} disabled={pending}>Forgot password?</button>
            )}

            {error && <p className="border border-rose/20 bg-rose/10 px-3 py-2 text-xs text-rose">{error}</p>}
            {notice && <p className="border border-acid/20 bg-acid/10 px-3 py-2 text-xs text-acid">{notice}</p>}

            <button type="submit" disabled={pending || !configured} className="flex h-11 w-full items-center justify-center gap-2 bg-acid text-sm font-semibold text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
              {pending ? <LoaderCircle className="animate-spin" size={16} /> : <>{authMode === 'signup' ? 'Create account' : 'Log in'} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-white/10" /><span className="text-[10px] uppercase tracking-[0.18em] text-white/25">or</span><span className="h-px flex-1 bg-white/10" /></div>

          <button type="button" disabled={pending || !configured} onClick={handleGoogle} className="flex h-11 w-full items-center justify-center gap-3 border border-white/10 bg-white/[0.04] text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-40">
            <span className="flex size-5 items-center justify-center bg-white text-xs font-bold text-ink">G</span>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-white/40">
            {authMode === 'signup' ? 'Already have an account?' : 'New to TalkOps?'}{' '}
            <button type="button" className="font-semibold text-white hover:text-acid" onClick={() => { setError(''); setNotice(''); openAuth(authMode === 'signup' ? 'login' : 'signup'); }}>
              {authMode === 'signup' ? 'Log in' : 'Create account'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
