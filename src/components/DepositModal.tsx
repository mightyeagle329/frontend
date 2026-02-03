"use client";

import Image from "next/image";
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

type Step = "fund" | "deposit" | "transfer";

export function DepositModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("fund");
  const [referralEnabled, setReferralEnabled] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const walletLabel = connected && publicKey ? shortPk(publicKey.toBase58()) : "4HbR2…9bGD";

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
        className="absolute left-[7px] bottom-[14px] w-[388px] rounded-[30px]"
        style={{
          background:
            "linear-gradient(#171717, #171717) padding-box, linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #E96023 78.12%) border-box",
          border: "3px solid transparent",
          boxShadow: "0px 14px 60px rgba(0,0,0,0.55)",
          height:
            step === "fund"
              ? "422px"
              : step === "deposit"
                ? "472px"
                : "574px",
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[27px] bg-[#171717] px-5 pt-5 pb-6">
          {step === "fund" ? (
            <>
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

              <button
                type="button"
                onClick={() => setStep("deposit")}
                className="mt-auto h-[53px] rounded-[16px] bg-[#FF4F00] font-ibm text-[16px] font-semibold text-white shadow-[0px_2px_32.8px_0px_#E9602378]"
              >
                Continue to Deposit
              </button>
            </>
          ) : step === "deposit" ? (
            <>
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => setStep("fund")}
                  className="grid h-[33px] w-[33px] place-items-center rounded-full bg-white/5 text-white/70"
                >
                  <svg
                    width={15}
                    height={12}
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-scale-y-100 text-white"
                  >
                    <path
                      d="M14 6H1M1 6L6 1M1 6L6 11"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="font-ibm text-[18px] font-semibold">Deposit</div>
                <div className="h-[33px] w-[33px]" />
              </div>

              <div className="mt-4 font-ibm text-[13px] text-white/45">Token</div>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-between rounded-[16px] bg-[#101010] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/usdt.png"
                    alt="USDT"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-contain"
                  />
                  <div className="font-ibm text-[15px] font-semibold text-white">USDT</div>
                </div>
                <div className="flex items-center gap-2 font-ibm text-[14px] text-white">
                  $2,124
                  <span className="text-white/40">▾</span>
                </div>
              </button>

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-[16px] bg-[#101010] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/usdt.png"
                    alt="Wallet"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-contain"
                  />
                  <div className="text-left">
                    <div className="font-ibm text-[14px] font-semibold text-white">
                      Wallet ({walletLabel})
                    </div>
                    <div className="font-ibm text-[12px] text-white/40">
                      $1,232
                    </div>
                  </div>
                </div>
                <span className="font-ibm text-[18px] text-[#FF4F00]">✓</span>
              </button>

              <button
                type="button"
                className="mt-6 flex h-[53px] w-full items-center justify-center rounded-[16px] font-ibm text-[17px] font-bold text-white"
                style={{
                  background: "linear-gradient(90deg, #FF9D00 0%, #FF4F00 100%)",
                  boxShadow: "0px 2px 32.8px 0px #E9602378",
                }}
              >
                Continue
              </button>

              <div className="my-5 flex items-center gap-3 text-white/40">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-ibm text-[12px]">Or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[20px] bg-[#FFFFFF0D] px-4 py-4"
                onClick={() => setStep("transfer")}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#FF9D00]">
                    <svg
                      width={17}
                      height={14}
                      viewBox="0 0 17 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#FFFFFF]"
                    >
                      <path
                        d="M2 7H15M15 7L10 2M15 7L10 12"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-ibm text-[14px] font-semibold text-white">
                      Transfer Crypto
                    </div>
                    <div className="font-ibm text-[12px] text-white/45">
                      Send from other wallet
                    </div>
                  </div>
                </div>
                <div className="flex items-center rounded-[1000px] px-2 py-[4px]">
                  <Image
                    src="/icons/binance.jpg"
                    alt="Binance"
                    width={25}
                    height={25}
                    className="h-[25px] w-[25px] rounded-full object-cover -scale-x-100 z-40"
                  />
                  <Image
                    src="/icons/ethereum.png"
                    alt="Ethereum"
                    width={25}
                    height={25}
                    className="-ml-[6px] h-[25px] w-[25px] rounded-full object-cover z-30"
                  />
                  <Image
                    src="/icons/polygon.png"
                    alt="Polygon"
                    width={25}
                    height={25}
                    className="-ml-[6px] h-[25px] w-[25px] rounded-full object-cover z-20"
                  />
                  <div className="-ml-[6px] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#2F2F2F] font-ibm text-[11px] text-white z-10">
                    +5
                  </div>
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  aria-label="Back to deposit"
                  onClick={() => setStep("deposit")}
                  className="grid h-[33px] w-[33px] place-items-center rounded-full bg-white/5 text-white/70"
                >
                  <svg
                    width={15}
                    height={12}
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-scale-y-100 text-white"
                  >
                    <path
                      d="M14 6H1M1 6L6 1M1 6L6 11"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="font-ibm text-[18px] font-semibold">Transfer Crypto</div>
                <div className="h-[33px] w-[33px]" />
              </div>

              {/* Chain + token selectors */}
              <div className="mt-6 flex justify-between gap-4">
                <div className="flex-1">
                  <div className="font-ibm text-[13px] text-white/45">Current Chain</div>
                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-between rounded-[18px] bg-[#101010] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/binance.jpg"
                        alt="BNB Chain"
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover -scale-x-100"
                      />
                      <span className="font-ibm text-[14px] font-semibold text-white">
                        BNB Chain
                      </span>
                    </div>
                    <span className="text-white/40">▾</span>
                  </button>
                </div>
                <div className="flex-1">
                  <div className="font-ibm text-[13px] text-white/45">Supported token</div>
                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-between rounded-[18px] bg-[#101010] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/usdt.png"
                        alt="USDT"
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-contain"
                      />
                      <span className="font-ibm text-[14px] font-semibold text-white">USDT</span>
                    </div>
                    <span className="text-white/40">▾</span>
                  </button>
                </div>
              </div>

              {/* QR code placeholder */}
              <div className="mt-8 flex justify-center">
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-[16px] bg-white">
                  <div className="h-[196px] w-[196px] bg-[repeating-linear-gradient(90deg,black_0,black_4px,white_4px,white_8px)] opacity-80 mix-blend-multiply" />
                </div>
              </div>

              {/* Deposit address */}
              <div className="mt-6 text-center font-ibm text-[13px] text-white/45">
                Your deposit address
              </div>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-[16px] bg-[#101010] px-4 py-3"
                onClick={() => {
                  void navigator.clipboard?.writeText("0xfbdd37b42ff7907abb53763b0f00b4...");
                }}
              >
                <span className="truncate font-ibm text-[13px] text-white">
                  0xfbdd37b42ff7907abb53763b0f00b4...
                </span>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white/70"
                >
                  <rect
                    x="5"
                    y="5"
                    width="9"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="9"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setStep("deposit")}
                className="mt-auto h-[53px] w-full rounded-[16px] bg-[#212121] font-ibm text-[16px] font-semibold text-white"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
