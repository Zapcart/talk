'use client';

import { authenticatedFetch } from '@/lib/api-client';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import type { TalkOpsUser } from '@/types/talkops';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: TalkOpsUser | null;
  loading: boolean;
  configured: boolean;
  authModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuth: (mode?: 'login' | 'signup') => void;
  closeAuth: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<TalkOpsUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const syncProfile = useCallback(async (user: FirebaseUser, name?: string) => {
    const syncedProfile = await authenticatedFetch<TalkOpsUser>(user, '/api/auth/sync', {
      method: 'POST',
      body: JSON.stringify({
        name: name || user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
      }),
    });
    setProfile(syncedProfile);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    return onAuthStateChanged(getFirebaseAuth(), async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await syncProfile(user);
      } catch (error) {
        console.error('Unable to sync the TalkOps profile.', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
  }, [syncProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      configured: isFirebaseConfigured,
      authModalOpen,
      authMode,
      openAuth: (mode = 'login') => {
        setAuthMode(mode);
        setAuthModalOpen(true);
      },
      closeAuth: () => setAuthModalOpen(false),
      signInWithGoogle: async () => {
        const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
        await syncProfile(result.user);
        setAuthModalOpen(false);
      },
      signInWithEmail: async (email, password) => {
        const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        await syncProfile(result.user);
        setAuthModalOpen(false);
      },
      signUpWithEmail: async (name, email, password) => {
        const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
        await syncProfile(result.user, name);
        setAuthModalOpen(false);
      },
      resetPassword: async (email) => sendPasswordResetEmail(getFirebaseAuth(), email),
      signOut: async () => {
        await firebaseSignOut(getFirebaseAuth());
        setProfile(null);
      },
      refreshProfile: async () => {
        if (firebaseUser) await syncProfile(firebaseUser);
      },
    }),
    [authModalOpen, authMode, firebaseUser, loading, profile, syncProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
