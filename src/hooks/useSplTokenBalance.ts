"use client";

import { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";

export function useSplTokenBalance({
  mint,
  decimals,
}: {
  mint: PublicKey;
  decimals: number;
}) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const owner = publicKey;

  const ataPromise = useMemo(() => {
    if (!owner) return null;
    return getAssociatedTokenAddress(mint, owner, false, TOKEN_PROGRAM_ID);
  }, [mint, owner]);

  useEffect(() => {
    let cancelled = false;

    if (!owner) {
      setBalance(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const ata = await ataPromise;
        if (!ata) throw new Error("Missing token account");

        // If ATA doesn't exist, treat as 0.
        const acc = await getAccount(connection, ata);
        const raw = Number(acc.amount);
        const ui = raw / 10 ** decimals;
        if (!cancelled) setBalance(ui);
      } catch (e) {
        // Most common error: ATA not found => 0 balance
        const msg = e instanceof Error ? e.message : "Failed to load balance";
        if (!cancelled) {
          if (msg.toLowerCase().includes("could not find") || msg.toLowerCase().includes("does not exist")) {
            setBalance(0);
            setError(null);
          } else {
            setBalance(null);
            setError(msg);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBalance();
    const id = window.setInterval(fetchBalance, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [ataPromise, connection, decimals, owner]);

  return { balance, loading, error };
}
