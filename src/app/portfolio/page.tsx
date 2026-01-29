"use client";

import { BottomNav } from "@/components/BottomNav";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function PortfolioPage() {
  const [topTab, setTopTab] = useState<"trades" | "watchlist">("trades");
  const [subTab, setSubTab] = useState<
    "position" | "open" | "closed" | "transactions"
  >("position");

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const tabsWrapRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<"trades" | "watchlist", HTMLButtonElement | null>>({
    trades: null,
    watchlist: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(
    { left: 0, width: 44 },
  );

  useEffect(() => {
    const wrap = tabsWrapRef.current;
    const btn = tabRefs.current[topTab];
    if (!wrap || !btn) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - wrapRect.left,
      width: btnRect.width,
    });

    const onResize = () => {
      const w = tabsWrapRef.current;
      const b = tabRefs.current[topTab];
      if (!w || !b) return;
      const wr = w.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      setIndicator({ left: br.left - wr.left, width: br.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [topTab]);

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden bg-black pb-24 text-white"
    >
      {/* Header card (pixel-based) */}
      <div className="relative h-[320px]">
        {/* Rectangle: 380x237 @ (12,63) */}
        <div className="absolute left-[12px] top-[63px] h-[237px] w-[380px] rounded-[16px] bg-[#151515]" />

        {/* balance icon (match HomeHeader visual scale) */}
        <div
          className="absolute left-[32px] top-[86px]"
          style={{ filter: "drop-shadow(0px 1px 13.6px #3EB8FF)" }}
        >
          <div className="relative h-[18px] w-[21px] overflow-visible text-[#3EB8FF]">
            <Image
              src="/icons/balance.svg"
              alt=""
              fill
              className="object-contain origin-center scale-[2.5]"
            />
          </div>
        </div>

        {/* BALANCE SPOT text @ (58,86) */}
        <div className="absolute left-[58px] top-[86px] h-[20px] w-[107px] whitespace-nowrap font-ibm text-[15px] font-normal leading-[20px] tracking-[0.07em] text-[#3EB8FF]">
          BALANCE SPOT
        </div>

        {/* Amount @ (244,81) */}
        <div className="absolute left-[244px] top-[81px] h-[38px] w-[126px] text-right font-ibm text-[29px] font-semibold leading-[29px]">
          $4,206.91
        </div>

        {/* usdt.png: 44x44 @ (30,119) */}
        <div className="absolute left-[30px] top-[119px] h-[44px] w-[44px]">
          <Image
            src="/icons/usdt.png"
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-contain"
          />
        </div>

        {/* USDT label @ (86,121) */}
        <div className="absolute left-[86px] top-[121px] h-[20px] w-[35px] font-ibm text-[15px] font-bold leading-[20px]">
          USDT
        </div>

        {/* 1,240.50 USDT @ (86,141), opacity 0.4 */}
        <div className="absolute left-[86px] top-[141px] h-[20px] w-[93px] font-ibm text-[15px] font-normal leading-[20px] text-white/40">
          1,240.50 USDT
        </div>

        {/* Withdraw button: 154x53 @ (32,189) */}
        <button
          type="button"
          className="absolute left-[32px] top-[189px] h-[53px] w-[154px] rounded-[16px] bg-[#FFFFFF12]"
          onClick={() => setWithdrawOpen(true)}
        >
          <span className="font-ibm text-[17px] font-bold leading-[20px]">
            Withdraw
          </span>
        </button>

        {/* Deposit button: 178x53 @ (194,189) */}
        <button
          type="button"
          className="absolute left-[194px] top-[189px] h-[53px] w-[178px] rounded-[16px] bg-[#A10FCA] shadow-[0px_2px_32.8px_0px_#A10FCAEB]"
          onClick={() => setDepositOpen(true)}
        >
          <span className="font-ibm text-[17px] font-bold leading-[20px]">
            Deposit
          </span>
        </button>

        {/* View History log @ (153,260) */}
        <div className="absolute left-[153px] top-[260px] h-[20px] w-[99px] text-center font-ibm text-[15px] font-normal leading-[20px] text-white/40">
          View History log
        </div>
      </div>

      {/* Top tabs (Trades / WatchList) with colored underline like Leaderboard */}
      <div className="mt-1 px-4">
        <div className="relative w-full border-b border-white/10 pb-3">
          <div ref={tabsWrapRef} className="relative flex gap-6">
            <button
              type="button"
              onClick={() => setTopTab("trades")}
              ref={(el) => {
                tabRefs.current.trades = el;
              }}
              className={
                topTab === "trades"
                  ? "font-ibm text-[14px] text-white"
                  : "font-ibm text-[14px] text-white/45"
              }
            >
              Trades
            </button>
            <button
              type="button"
              onClick={() => setTopTab("watchlist")}
              ref={(el) => {
                tabRefs.current.watchlist = el;
              }}
              className={
                topTab === "watchlist"
                  ? "font-ibm text-[14px] text-white"
                  : "font-ibm text-[14px] text-white/45"
              }
            >
              WatchList
            </button>

            {/* Selected underline aligned to selected word */}
            <div
              className="absolute -bottom-px h-px bg-[#A10FCA] transition-[left,width] duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          </div>
        </div>
      </div>

      {/* Secondary pills */}
      <div className="mt-4 px-4">
        <div className="flex gap-3 overflow-hidden">
          <SubPill
            label="Position"
            active={subTab === "position"}
            onClick={() => setSubTab("position")}
          />
          <SubPill
            label="Open Orders"
            active={subTab === "open"}
            onClick={() => setSubTab("open")}
          />
          <SubPill
            label="Closed Orders"
            active={subTab === "closed"}
            onClick={() => setSubTab("closed")}
          />
          <SubPill
            label="Transac"
            active={subTab === "transactions"}
            onClick={() => setSubTab("transactions")}
          />
        </div>
      </div>

      {/* Positions list */}
      <div className="mt-4 space-y-4 px-4">
        <PositionCardYes />
        {/* NO position card is partially cut in the screenshot; we keep the same layout and allow it to clip naturally */}
        <PositionCardNo />
      </div>

      <BottomNav />

      {depositOpen ? <DepositModal onClose={() => setDepositOpen(false)} /> : null}
      {withdrawOpen ? <WithdrawModal onClose={() => setWithdrawOpen(false)} /> : null}
    </div>
  );
}

function SubPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "whitespace-nowrap rounded-full bg-[#A10FCA] px-4 py-2 font-ibm text-[13px] text-white"
          : "whitespace-nowrap rounded-full bg-white/10 px-4 py-2 font-ibm text-[13px] text-white/85"
      }
    >
      {label}
    </button>
  );
}

function PositionCardYes() {
  return (
    <div className="rounded-[18px] bg-white/5 px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-ibm text-[12px] tracking-[0.11em] text-[#49F347]">
            YES POSITION
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold">
            Bitcoin &gt; $100k?
          </div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[14px] text-[#49F347]">+12.00%</div>
          <div className="font-ibm text-[12px] text-white/40">P&L (Realized)</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <div className="font-ibm text-[11px] tracking-[0.11em] text-white/35">
            INITIAL STAKE
          </div>
          <div className="mt-1 font-ibm text-[16px] font-semibold">$100.00</div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[11px] tracking-[0.11em] text-white/35">
            CURRENT VALUE
          </div>
          <div className="mt-1 font-ibm text-[16px] font-semibold text-[#49F347]">
            $112.00
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 h-[44px] w-full rounded-[14px] bg-white/10 font-ibm text-[14px] font-semibold"
      >
        Exit Position
      </button>
    </div>
  );
}

function PositionCardNo() {
  return (
    <div className="rounded-[18px] bg-white/5 px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-ibm text-[12px] tracking-[0.11em] text-[#E83D36]">
            NO POSITION
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold">
            Tesla Earnings Beat?
          </div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[14px] text-[#E83D36]">-4.00%</div>
          <div className="font-ibm text-[12px] text-white/40">P&L (Realized)</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <div className="font-ibm text-[11px] tracking-[0.11em] text-white/35">
            INITIAL STAKE
          </div>
          <div className="mt-1 font-ibm text-[16px] font-semibold">$100.00</div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[11px] tracking-[0.11em] text-white/35">
            CURRENT VALUE
          </div>
          <div className="mt-1 font-ibm text-[16px] font-semibold text-[#E83D36]">
            $96.00
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 h-[44px] w-full rounded-[14px] bg-white/10 font-ibm text-[14px] font-semibold"
      >
        Exit Position
      </button>
    </div>
  );
}
