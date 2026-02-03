"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

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

export function DepositModal({ onClose }: { onClose: () => void }) {
  const [referralEnabled, setReferralEnabled] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  // NOTE: This component currently implements only the “Fund your Account” bottom sheet
  // from the provided design. If you share the next-step deposit form design, I’ll
  // implement the flow after the CTA.

  return (
    <div className="fixed inset-0 z-[80] mx-auto w-full max-w-[402px]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal card (bottom sheet) */}
      <div
        className="absolute left-[7px] bottom-[14px] h-[422px] w-[388px] rounded-[30px]"
        style={{
          background:
            "linear-gradient(#171717, #171717) padding-box, linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #E96023 78.12%) border-box",
          border: "3px solid transparent",
          boxShadow: "0px 14px 60px rgba(0,0,0,0.55)",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[27px] bg-[#171717] px-5 pt-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="font-ibm text-[18px] font-semibold">Fund your Account</div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
            >
              <span className="text-[18px] leading-none">×</span>
            </button>
          </div>

          <div className="mt-4 font-ibm text-[13px] text-white/50">
            Balance in your proxy wallet
          </div>

          {/* Wallet row */}
          <button
            type="button"
            onClick={() => {
              if (!connected) setVisible(true);
            }}
            className="mt-3 flex w-full items-center justify-between rounded-[16px] bg-white/5 px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="text-left">
                <div className="font-ibm text-[14px] font-semibold">
                  {connected && publicKey
                    ? `user${shortPk(publicKey.toBase58()).replace(/\./g, "")}`
                    : "Connect Wallet"}
                </div>
                <div className="font-ibm text-[12px] text-white/40">
                  {connected && publicKey ? shortPk(publicKey.toBase58()) : ""}
                </div>
              </div>
            </div>
            <div className="font-ibm text-[14px] font-semibold text-white">
              ${formatAmount(15347, 0)}
            </div>
          </button>

          {/* Referral code */}
          <div className="mt-5 font-ibm text-[13px] text-white/50">Enter referral code</div>
          <div className="mt-2 rounded-[16px] bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="font-ibm text-[14px] font-semibold text-white/90">
                Have a referral code?
              </div>
              <button
                type="button"
                onClick={() => setReferralEnabled((v) => !v)}
                className={
                  referralEnabled
                    ? "relative h-[22px] w-[44px] rounded-full bg-[#FF4F00]"
                    : "relative h-[22px] w-[44px] rounded-full bg-white/10"
                }
                aria-label="Toggle referral"
              >
                <span
                  className={
                    referralEnabled
                      ? "absolute right-[2px] top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-all"
                      : "absolute left-[2px] top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-all"
                  }
                />
              </button>
            </div>
            {referralEnabled ? (
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Referral code"
                className="mt-3 h-[40px] w-full rounded-[12px] bg-black/30 px-3 font-ibm text-[13px] outline-none placeholder:text-white/30"
              />
            ) : null}
          </div>

          {/* Continue to Deposit button */}
          <button
            type="button"
            onClick={() => {
              console.log("[deposit] continue", { referralEnabled, referralCode });
            }}
            className="absolute left-[28px] top-[337px] h-[53px] w-[346px] rounded-[16px] bg-[#FF4F00] font-ibm text-[16px] font-semibold text-white shadow-[0px_2px_32.8px_0px_#E9602378]"
          >
            Continue to Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
