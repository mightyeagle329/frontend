"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { SolanaAuthPayload } from "@/lib/walletAuth";
import { buildSolanaAuthMessage, encodeSignedMessage } from "@/lib/walletAuth";
import { useAuthSession } from "@/providers/AuthSessionProvider";

type LoginRequest = {
  auth_provider: string;
  user_key: string;
  signed_msg: string;
  msg: string;
};

const STORAGE_KEY = "solanaAuthPayload";

export function useWalletAuth() {
  const { connected, publicKey, signMessage } = useWallet();
  const { session, setSession } = useAuthSession();

  const [payload, setPayload] = useState<SolanaAuthPayload | null>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SolanaAuthPayload) : null;
    } catch {
      return null;
    }
  });

  // If wallet changes, invalidate existing payload (signature won’t match).
  useEffect(() => {
    if (!connected || !publicKey) {
      setPayload(null);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }

    if (!payload) return;

    try {
      const msgObj = JSON.parse(payload.message) as { sender?: string };
      if (msgObj.sender && msgObj.sender !== publicKey.toBase58()) {
        setPayload(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      setPayload(null);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey?.toBase58()]);

  const needsSignIn = useMemo(() => {
    if (!connected || !publicKey) return false;
    // If we already have a persisted backend session for this wallet, skip re-signing.
    if (session && session.user_key === publicKey.toBase58()) return false;
    return !payload;
  }, [connected, payload, publicKey, session]);

  const signIn = useCallback(async () => {
    if (!publicKey) throw new Error("Wallet not connected");
    if (!signMessage) throw new Error("Wallet does not support signMessage");

    const msgObj = buildSolanaAuthMessage({ sender: publicKey.toBase58() });
    const message = JSON.stringify(msgObj);
    const encoded = new TextEncoder().encode(message);

    // Phantom will show a signature confirmation.
    const signatureBytes = await signMessage(encoded);
    const signedMessage = encodeSignedMessage(signatureBytes);
    const next: SolanaAuthPayload = { message, signedMessage };

    setPayload(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }

    // Build backend login request shape.
    const loginReq: LoginRequest = {
      auth_provider: "wallet",
      user_key: publicKey.toBase58(),
      signed_msg: signedMessage,
      msg: message,
    };

    console.log("[wallet-auth] payload", next);
    console.log("[wallet-auth] login request", loginReq);

    // Send to backend via Next.js proxy (avoids CORS): /api/auth/login
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginReq),
      });
      const data = await res.json().catch(() => null);
      console.log("[wallet-auth] login response", res.status, data);

      // Persist tokens if present.
      // Backend response shape can vary; we try common keys.
      // If your backend returns a different shape, tell me and I’ll adapt.
      const access_token =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any)?.access_token ?? (data as any)?.data?.access_token;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refresh_token = (data as any)?.refresh_token ?? (data as any)?.data?.refresh_token;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const address = (data as any)?.address ?? (data as any)?.data?.address;

      if (typeof access_token === "string" && typeof refresh_token === "string") {
        setSession({
          auth_provider: "wallet",
          user_key: publicKey.toBase58(),
          address: typeof address === "string" ? address : undefined,
          access_token,
          refresh_token,
          raw: data,
          created_at: Date.now(),
        });
        console.log("[wallet-auth] session saved");
      } else {
        console.log(
          "[wallet-auth] tokens not found in response; session not saved",
        );
      }
    } catch (e) {
      console.log(
        "[wallet-auth] login error",
        e instanceof Error ? e.message : e,
      );
    }
    return next;
  }, [publicKey, setSession, signMessage]);

  const signOut = useCallback(() => {
    setPayload(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    connected,
    publicKey,
    payload,
    needsSignIn,
    signIn,
    signOut,
  };
}
