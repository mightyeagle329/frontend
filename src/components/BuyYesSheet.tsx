"use client";

import Image from "next/image";

export function BuyYesSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0">
      {/* Content wrapper */}
      <div className="absolute inset-0 px-6 pt-14">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-ibm text-[12px] tracking-[0.14em] text-white/40">
              AVAILABLE BALANCE
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Image
                src="/icons/usdt.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-contain"
              />
              <div className="font-ibm text-[22px] font-semibold">$1,240</div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-[40px] w-[40px] place-items-center rounded-full bg-white/10"
          >
            <span className="text-[18px] leading-none text-white">×</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="mt-16 flex flex-col items-center">
          <div className="rounded-[26px] bg-gradient-to-br from-[#3EB8FF] via-[#BA22E5] to-[#49F347] p-[3px]">
            <div className="h-[106px] w-[106px] overflow-hidden rounded-[23px] bg-black/60">
              <Image
                src="/icons/bg_prediction.png"
                alt=""
                width={106}
                height={106}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-4 font-ibm text-[14px] tracking-[0.04em] text-[#3EB8FF]">
            Buy <span className="font-semibold">YES</span> 99c
          </div>

          <div className="mt-3 max-w-[320px] text-center font-ibm text-[28px] font-semibold leading-[30px]">
            US Fed Rate Decision in January? - No change
          </div>
        </div>

        {/* Amount quick buttons */}
        <div className="mt-6 flex justify-center gap-3">
          {[
            { label: "10" },
            { label: "50" },
            { label: "100" },
            { label: "Max" },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              className="h-[40px] w-[72px] rounded-full bg-white/10 font-ibm text-[16px] font-semibold"
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="mt-5 rounded-full border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <button type="button" className="h-8 w-8 rounded-full bg-white/10">
              <span className="block text-center text-[18px] leading-8">−</span>
            </button>

            <div className="flex items-baseline gap-2">
              <span className="font-ibm text-[18px] font-semibold">0</span>
              <span className="font-ibm text-[12px] tracking-[0.12em] text-white/40">
                USDT
              </span>
            </div>

            <button type="button" className="h-8 w-8 rounded-full bg-white/10">
              <span className="block text-center text-[18px] leading-8">+</span>
            </button>
          </div>
        </div>

        {/* Target price */}
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
          <div className="font-ibm text-[14px] text-white/60">
            Set target price
          </div>
          <button
            type="button"
            aria-label="Toggle target price"
            className="relative h-[26px] w-[44px] rounded-full bg-white/15"
          >
            <span className="absolute left-[3px] top-[3px] h-[20px] w-[20px] rounded-full bg-white" />
          </button>
        </div>

        {/* Win line */}
        <div className="mt-6 text-center font-ibm text-[14px] text-white/70">
          Win <span className="text-[#49F347]">$0 (+0% Profit)</span>
        </div>

        {/* Buy button */}
        <button
          type="button"
          className="mt-6 h-[54px] w-full rounded-[18px] bg-[#A10FCA] font-ibm text-[16px] font-semibold"
        >
          Buy $0
        </button>

        {/* Fee */}
        <div className="mt-6 flex items-center justify-between font-ibm text-[13px] text-white/30">
          <span>Est. Fee</span>
          <span>0$ (0%)</span>
        </div>
      </div>
    </div>
  );
}
