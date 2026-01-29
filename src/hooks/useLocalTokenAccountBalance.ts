"use client";

import { useCallback, useState } from "react";

/**
 * UI-only “account balance” stored in localStorage.
 * This represents the in-app balance (not the wallet balance).
 *
 * Keyed by token symbol for now (USDT).
 */
export function useLocalTokenAccountBalance({
  symbol,
  initial = 0,
}: {
  symbol: string;
  initial?: number;
}) {
  const key = `demoAccountBalance:${symbol}`;
  const [balance, setBalance] = useState<number>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) {
        window.localStorage.setItem(key, String(initial));
        return initial;
      }
      const n = Number(raw);
      return Number.isFinite(n) ? n : initial;
    } catch {
      return initial;
    }
  });

  const persist = useCallback(
    (next: number) => {
      const safe = Number.isFinite(next) ? Math.max(0, next) : 0;
      setBalance(safe);
      try {
        window.localStorage.setItem(key, String(safe));
      } catch {
        // ignore
      }
    },
    [key],
  );

  const deposit = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      persist(balance + amount);
    },
    [balance, persist],
  );

  const withdraw = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      persist(balance - amount);
    },
    [balance, persist],
  );

  return { balance, setBalance: persist, deposit, withdraw };
}
