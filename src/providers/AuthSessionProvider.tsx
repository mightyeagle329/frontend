"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AuthSession = {
  auth_provider: "wallet";
  user_key: string; // wallet address
  address?: string; // backend-provided address (deposit/withdraw address)
  access_token: string;
  refresh_token: string;
  raw?: unknown;
  created_at: number;
};

type Ctx = {
  session: AuthSession | null;
  setSession: (next: AuthSession | null) => void;
  clearSession: () => void;
};

const STORAGE_KEY = "authSession";

const AuthSessionContext = createContext<Ctx | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  });

  const setSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
    try {
      if (!next) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const clearSession = useCallback(() => setSession(null), [setSession]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setSessionState(e.newValue ? (JSON.parse(e.newValue) as AuthSession) : null);
      } catch {
        setSessionState(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) throw new Error("useAuthSession must be used within AuthSessionProvider");
  return ctx;
}
