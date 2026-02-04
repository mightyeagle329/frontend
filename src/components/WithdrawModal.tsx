"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_TOKENS } from "@/lib/solanaTokens";
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
  const token = SOLANA_TOKENS[0];
  const minWithdraw = 5;

  const { publicKey, connected } = useWallet();

  const account = useLocalTokenAccountBalance({ symbol: token.symbol, initial: 0 });

  const address = publicKey ? publicKey.toBase58() : "";
  const [amount, setAmount] = useState<string>("0");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const addressOk = connected && publicKey ? isValidSolanaAddress(address) : false;
  const amountOk = parsedAmount >= minWithdraw && parsedAmount <= account.balance;
  const canWithdraw = connected && addressOk && amountOk && status === "idle";

  const onMax = () => setAmount(String(Number(account.balance.toFixed(6))));

  const submit = async () => {
    if (!canWithdraw) return;
    setError(null);
    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 600));
      account.withdraw(parsedAmount);
      setStatus("success");
      window.setTimeout(onClose, 800);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Withdraw failed");
      window.setTimeout(() => setStatus("idle"), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] mx-auto w-full max-w-[402px]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        className="absolute left-[7px] top-[296px] w-[388px] rounded-[30px]"
        style={{
          background:
            "linear-gradient(#171717, #171717) padding-box, linear-gradient(138.53deg, #24233E 3.27%, #6A64FF 20.73%, #1D1A57 45.42%, #C3C1FB 69.11%, #423F8F 97.18%) border-box",
          border: "3px solid transparent",
          boxShadow: "0px 14px 60px rgba(0,0,0,0.55)",
          height: "574px",
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[27px] bg-[#171717] px-5 pt-5 pb-6">
          <div className="flex items-start justify-between">
            <div className="font-ibm text-[18px] font-semibold">Withdraw</div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
            >
              <span className="text-[18px] leading-none">×</span>
            </button>
          </div>

          <div className="mt-5 font-ibm text-[13px] text-white/45">Current Chain</div>
          <button
            type="button"
            className="mt-2 flex h-[54px] w-full items-center justify-between rounded-[18px] bg-[#101010] px-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/icons/binance.jpg"
                alt="BNB Chain"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover -scale-x-100"
              />
              <span className="font-ibm text-[15px] font-semibold text-white">BNB Chain</span>
            </div>
            <span className="text-white/40">▾</span>
          </button>

          <div className="mt-4 font-ibm text-[13px] text-white/45">Select a Token</div>
          <button
            type="button"
            className="mt-2 flex h-[54px] w-full items-center justify-between rounded-[18px] bg-[#101010] px-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/icons/usdt.png"
                alt="USDT"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-contain"
              />
              <span className="font-ibm text-[15px] font-semibold text-white">USDT</span>
            </div>
            <span className="text-white/40">▾</span>
          </button>

          <div className="mt-5 font-ibm text-[13px] text-white/45">Withdrawal Address</div>
          <input
            value={address}
            readOnly
            className="mt-2 h-[54px] w-full rounded-[18px] bg-[#101010] px-4 font-ibm text-[14px] text-white/85 outline-none"
          />
          {!connected ? (
            <div className="mt-1 font-ibm text-[12px] text-white/40">
              Connect wallet to fill withdrawal address automatically.
            </div>
          ) : !addressOk ? (
            <div className="mt-1 font-ibm text-[12px] text-[#E83D36]">Invalid address</div>
          ) : null}

          <div className="mt-5 flex items-center justify-between font-ibm text-[13px] text-white/45">
            <span>Amount (min {minWithdraw})</span>
            <span>Available: ${formatAmount(account.balance, 2)}</span>
          </div>
          <div className="mt-2 flex h-[54px] items-center rounded-[18px] bg-[#101010] px-4">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              className="w-full bg-transparent font-ibm text-[18px] text-white outline-none"
            />
            <button
              type="button"
              onClick={onMax}
              className="ml-3 h-[31px] w-[59px] rounded-[11px] bg-[#E96023] font-ibm text-[12px] font-semibold text-white"
            >
              MAX
            </button>
          </div>
          {!amountOk && parsedAmount > 0 ? (
            <div className="mt-1 font-ibm text-[12px] text-[#E83D36]">
              {parsedAmount < minWithdraw
                ? `Minimum ${minWithdraw} ${token.symbol}`
                : "Insufficient balance"}
            </div>
          ) : null}

          {error ? (
            <div className="mt-3 rounded-[12px] bg-[#E83D36]/10 px-3 py-2 font-ibm text-[12px] text-[#E83D36]">
              {error}
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-[53px] flex-1 rounded-[16px] bg-[#2A2A2A] font-ibm text-[16px] font-semibold text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canWithdraw}
              onClick={submit}
              className={
                canWithdraw
                  ? "h-[53px] w-[171px] rounded-[16px] bg-[#E96023] font-ibm text-[16px] font-semibold text-white shadow-[0px_2px_32.8px_0px_#E9602378]"
                  : "h-[53px] w-[171px] rounded-[16px] bg-[#E96023]/40 font-ibm text-[16px] font-semibold text-white/60"
              }
            >
              {status === "submitting" ? "Processing…" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
