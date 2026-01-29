"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SOLANA_TOKENS } from "@/lib/solanaTokens";
import { useSplTokenBalance } from "@/hooks/useSplTokenBalance";
import { useLocalTokenAccountBalance } from "@/hooks/useLocalTokenAccountBalance";

function formatAmount(amount: number, digits = 4) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function shortPk(pk: string) {
  if (pk.length <= 10) return pk;
  return `${pk.slice(0, 5)}...${pk.slice(-4)}`;
}

type Step = "select" | "amount";

export function DepositModal({ onClose }: { onClose: () => void }) {
  const token = SOLANA_TOKENS[0];
  const [step, setStep] = useState<Step>("select");
  const [amount, setAmount] = useState<string>("0");

  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const { balance, loading } = useSplTokenBalance({
    mint: token.mint,
    decimals: token.decimals,
  });

  // Demo “in-app” account balance (separate from wallet balance)
  const account = useLocalTokenAccountBalance({ symbol: token.symbol, initial: 0 });

  const walletBalance = balance ?? 0;

  const parsedAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canConfirm = parsedAmount > 0 && parsedAmount <= walletBalance;

  const setPct = (pct: number) => {
    const v = (walletBalance * pct) / 100;
    setAmount(String(Number(v.toFixed(6))));
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

      {/* Modal card */}
      <div className="absolute left-1/2 top-[120px] w-[360px] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[#141414] p-5 shadow-[0px_14px_60px_rgba(0,0,0,0.55)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="font-ibm text-[20px] font-semibold">Deposit</div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
          >
            <span className="text-[18px] leading-none">×</span>
          </button>
        </div>

        {step === "select" ? (
          <>
            <div className="mt-4 font-ibm text-[14px] text-white/60">Token</div>

            {/* Token row */}
            <div className="mt-2 flex h-[54px] items-center justify-between rounded-[16px] border border-white/10 bg-black/20 px-4">
              <div className="flex items-center gap-3">
                <Image
                  src={token.iconSrc}
                  alt=""
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] rounded-full object-contain"
                />
                <div className="font-ibm text-[16px] font-semibold">{token.symbol}</div>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="font-ibm text-[14px]">
                  {loading ? "…" : formatAmount(walletBalance, 4)}
                </span>
              </div>
            </div>

            {/* Wallet select row */}
            <button
              type="button"
              onClick={() => {
                if (!connected) setVisible(true);
              }}
              className="mt-3 flex w-full items-center justify-between rounded-[16px] bg-white/5 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                  <Image
                    src={token.iconSrc}
                    alt=""
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] rounded-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="font-ibm text-[14px] font-semibold">
                    {connected && publicKey
                      ? `Wallet (${shortPk(publicKey.toBase58())})`
                      : "Connect Wallet"}
                  </div>
                  <div className="font-ibm text-[12px] text-white/50">
                    {connected
                      ? `Wallet Balance: ${loading ? "…" : formatAmount(walletBalance, 4)}`
                      : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="font-ibm text-[14px] text-white/70">
                  {connected ? "✓" : ""}
                </div>
              </div>
            </button>

            {/* Continue */}
            <button
              type="button"
              disabled={!connected}
              onClick={() => setStep("amount")}
              className={
                !connected
                  ? "mt-5 h-[52px] w-full rounded-[16px] bg-[#FF7A2A]/40 font-ibm text-[16px] font-semibold text-black/60"
                  : "mt-5 h-[52px] w-full rounded-[16px] bg-[#FF7A2A] font-ibm text-[16px] font-semibold text-black"
              }
            >
              Continue
            </button>

            {/* OR divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <div className="font-ibm text-[12px] text-white/40">OR</div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-[16px] bg-white/5 px-4 py-4"
            >
              <div>
                <div className="font-ibm text-[14px] font-semibold">Transfer Crypto</div>
                <div className="font-ibm text-[12px] text-white/50">No limit / Instant</div>
              </div>
              <div className="text-white/40">›</div>
            </button>
          </>
        ) : (
          <>
            <div className="mt-2 font-ibm text-[14px] text-white/60">
              Account Balance: {formatAmount(account.balance, 4)} {token.symbol}
            </div>

            <div className="mt-8 flex flex-col items-center">
              <Image
                src={token.iconSrc}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-contain"
              />
              <div className="mt-2 font-ibm text-[14px] font-semibold">{token.symbol}</div>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                className="mt-4 w-full bg-transparent text-center font-ibm text-[48px] font-semibold outline-none"
              />

              <div className="mt-3 font-ibm text-[14px] text-white/60">
                Wallet Balance: {loading ? "…" : formatAmount(walletBalance, 4)}
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-3">
              {[25, 50, 75].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPct(p)}
                  className="h-[34px] rounded-full bg-white/10 px-4 font-ibm text-[14px]"
                >
                  {p}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(Number(walletBalance.toFixed(6))))}
                className="h-[34px] rounded-full bg-white/10 px-4 font-ibm text-[14px]"
              >
                Max
              </button>
            </div>

            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => {
                // In a real app, Deposit would be an on-chain transfer to a
                // custody / program address + backend crediting.
                // For now (no backend), we simulate crediting the in-app account
                // and do NOT move funds on-chain.
                account.deposit(parsedAmount);
                onClose();
              }}
              className={
                canConfirm
                  ? "mt-7 h-[52px] w-full rounded-[16px] bg-white/10 font-ibm text-[16px] font-semibold text-white"
                  : "mt-7 h-[52px] w-full rounded-[16px] bg-white/5 font-ibm text-[16px] font-semibold text-white/30"
              }
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={() => setStep("select")}
              className="mt-4 w-full text-center font-ibm text-[14px] text-[#FF7A2A]"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
