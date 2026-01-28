"use client";

import { useEffect, useRef, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function useSolBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subRef = useRef<number | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const lamports = await connection.getBalance(publicKey);
        if (cancelled) return;
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load balance");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBalance();

    // IMPORTANT: some environments fail websockets ("ws error: undefined")
    // and some public RPCs block ws entirely. For stability, just poll.
    const interval = window.setInterval(fetchBalance, 10_000);

    return () => {
      cancelled = true;
      if (subRef.current != null) {
        connection.removeAccountChangeListener(subRef.current);
        subRef.current = null;
      }
      window.clearInterval(interval);
    };
  }, [publicKey, connection]);

  return { balance, loading, error };
}
