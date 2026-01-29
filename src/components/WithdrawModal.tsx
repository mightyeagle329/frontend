"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_TOKENS } from "@/lib/solanaTokens";
import { useSplTokenBalance } from "@/hooks/useSplTokenBalance";
import { useLocalTokenAccountBalance } from "@/hooks/useLocalTokenAccountBalance";

function formatAmount(amount: number, digits = 4) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function isValidSolanaAddress(addr: string) {
  try {
    // Will throw if invalid base58 or wrong length.
    // Use the value so eslint doesn't complain about a side-effect-only `new`.
    new PublicKey(addr).toBase58();
    return true;
  } catch {
    return false;
  }
}

export function WithdrawModal({ onClose }: { onClose: () => void }) {
  const token = SOLANA_TOKENS[0]; // USDT
  const minWithdraw = 5; // (matches screenshot)

  const { publicKey, connected } = useWallet();

  const { balance, loading } = useSplTokenBalance({
    mint: token.mint,
    decimals: token.decimals,
  });
  const walletBalance = balance ?? 0;

  // Demo “in-app” account balance (withdraw reduces this balance).
  const account = useLocalTokenAccountBalance({ symbol: token.symbol, initial: 0 });

  const address = publicKey ? publicKey.toBase58() : "";
  const [amount, setAmount] = useState<string>("0");
  const [status, setStatus] = useState<
    "idle" | "signing" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const addressOk = !connected || !publicKey ? false : isValidSolanaAddress(address);
  const amountOk = parsedAmount >= minWithdraw && parsedAmount <= account.balance;
  const canWithdraw = connected && !!publicKey && addressOk && amountOk && status === "idle";

  const onMax = () => setAmount(String(Number(account.balance.toFixed(6))));

  const submit = async () => {
    if (!publicKey) return;
    setError(null);

    // IMPORTANT: Real withdraw means the platform sends funds FROM its custody to the user's wallet.
    // That cannot be done purely client-side with Phantom (because Phantom can only sign for the
    // user's wallet). So we keep the UI + validation and simulate withdraw by decreasing the
    // in-app balance only.
    //
    // If/when you add a backend, this is where you'd call an API like:
    // POST /api/withdraw { amount, token, toAddress } and the backend would send the on-chain tx.
    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 700));
      account.withdraw(parsedAmount);
      setStatus("success");
      window.setTimeout(() => onClose(), 900);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Withdraw failed");
      window.setTimeout(() => setStatus("idle"), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] mx-auto w-full max-w-[402px]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="absolute left-1/2 top-[110px] w-[360px] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[#141414] p-5 shadow-[0px_14px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between">
          <div className="font-ibm text-[20px] font-semibold">Withdraw</div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
          >
            <span className="text-[18px] leading-none">×</span>
          </button>
        </div>

        {/* Current chain */}
        <div className="mt-4 font-ibm text-[14px] text-white/60">Current Chain</div>
        <div className="mt-2 flex h-[46px] items-center gap-3 rounded-[999px] border border-white/10 bg-black/20 px-4">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-white/5">
            <span className="text-[12px]">◎</span>
          </div>
          <div className="font-ibm text-[15px] font-semibold">SOLANA</div>
        </div>

        {/* Token */}
        <div className="mt-4 font-ibm text-[14px] text-white/60">Select a Token</div>
        <div className="mt-2 flex h-[46px] items-center justify-between rounded-[999px] border border-white/10 bg-black/20 px-4">
          <div className="flex items-center gap-3">
            <Image
              src={token.iconSrc}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 rounded-full object-contain"
            />
            <div className="font-ibm text-[14px] font-semibold">{token.symbol}</div>
          </div>
          {/* No dropdown for now */}
        </div>

        {/* Withdrawal address */}
        <div className="mt-4 font-ibm text-[14px] text-white/60">Withdrawal Address</div>
        <input
          value={address}
          readOnly
          className="mt-2 h-[46px] w-full rounded-[999px] border border-white/10 bg-black/20 px-4 font-ibm text-[13px] text-white/90 outline-none placeholder:text-white/30"
        />
        {!connected ? (
          <div className="mt-1 font-ibm text-[12px] text-white/40">
            Connect Phantom to see your withdrawal address.
          </div>
        ) : !addressOk ? (
          <div className="mt-1 font-ibm text-[12px] text-[#E83D36]">Invalid Solana address</div>
        ) : null}

        {/* Amount */}
        <div className="mt-4 font-ibm text-[14px] text-white/60">
          Amount ({minWithdraw} {token.symbol} min)
        </div>
        <div className="mt-2 flex h-[46px] items-center justify-between rounded-[999px] border border-white/10 bg-black/20 px-4">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            className="w-full bg-transparent font-ibm text-[16px] outline-none"
          />
          <div className="ml-3 flex items-center gap-3 whitespace-nowrap">
            <div className="font-ibm text-[14px] font-semibold">{token.symbol}</div>
            <button
              type="button"
              onClick={onMax}
              className="font-ibm text-[14px] font-semibold text-[#FF7A2A]"
            >
              Max
            </button>
          </div>
        </div>
        <div className="mt-2 flex justify-between font-ibm text-[12px] text-white/50">
          <span>{`Available: ${formatAmount(account.balance, 4)} ${token.symbol}`}</span>
          {!amountOk && parsedAmount > 0 ? (
            <span className="text-[#E83D36]">
              {parsedAmount < minWithdraw
                ? `Min ${minWithdraw}`
                : parsedAmount > account.balance
                  ? "Too much"
                  : ""}
            </span>
          ) : (
            <span />
          )}
        </div>

        {error ? (
          <div className="mt-3 rounded-[12px] bg-[#E83D36]/10 px-3 py-2 font-ibm text-[12px] text-[#E83D36]">
            {error}
          </div>
        ) : null}

        {/* Footer buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] rounded-[999px] bg-white/10 font-ibm text-[15px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canWithdraw}
            onClick={submit}
            className={
              canWithdraw
                ? "h-[46px] rounded-[999px] bg-white/10 font-ibm text-[15px] font-semibold"
                : "h-[46px] rounded-[999px] bg-white/5 font-ibm text-[15px] font-semibold text-white/30"
            }
          >
            {status === "signing" || status === "submitting" ? "Withdrawing…" : "Withdraw"}
          </button>
        </div>

        {!connected ? (
          <div className="mt-3 font-ibm text-[12px] text-white/40">
            Connect Phantom first to withdraw.
          </div>
        ) : null}

        <div className="mt-3 font-ibm text-[12px] text-white/40">
          Wallet Balance (USDT): {loading ? "…" : formatAmount(walletBalance, 4)}
        </div>
      </div>
    </div>
  );
}
