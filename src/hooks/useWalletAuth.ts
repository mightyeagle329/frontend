"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { SolanaAuthPayload } from "@/lib/walletAuth";
import { buildSolanaAuthMessage, encodeSignedMessage } from "@/lib/walletAuth";

const STORAGE_KEY = "solanaAuthPayload";

export function useWalletAuth() {
  const { connected, publicKey, signMessage } = useWallet();

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
    return !payload;
  }, [connected, payload, publicKey]);

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

    // For now: print the payload in the exact shape you’ll send to backend.
    // (Add api call later.)
    console.log("[wallet-auth] payload", next);
    return next;
  }, [publicKey, signMessage]);

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
