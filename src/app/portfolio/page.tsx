"use client";

import { BottomNav } from "@/components/BottomNav";
import { useState } from "react";

export default function PortfolioPage() {
  const [topTab, setTopTab] = useState<"trades" | "watchlist">("trades");
  const [subTab, setSubTab] = useState<
    "position" | "open" | "closed" | "transactions"
  >("position");

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden bg-black pb-24 text-white"
    >
      {/* Header card */}
      <div className="px-4 pt-6">
        <div className="rounded-[18px] bg-white/5 px-5 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-ibm text-[13px] tracking-[0.11em] text-cyan-200/80">
                BALANCE SPOT
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400/30">
                  <div className="h-5 w-5 rounded bg-emerald-300/80" />
                </div>
                <div>
                  <div className="font-ibm text-[14px] font-semibold">USDT</div>
                  <div className="font-ibm text-[12px] text-white/45">
                    1,240.50 USDT
                  </div>
                </div>
              </div>
            </div>

            <div className="font-ibm text-[26px] font-semibold">$4,206.91</div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              className="h-[44px] flex-1 rounded-[14px] bg-white/10 font-ibm text-[14px] font-semibold"
            >
              Withdraw
            </button>
            <button
              type="button"
              className="h-[44px] flex-1 rounded-[14px] bg-[#A10FCA] font-ibm text-[14px] font-semibold"
            >
              Deposit
            </button>
          </div>

          <div className="mt-3 text-center font-ibm text-[12px] text-white/35">
            View History log
          </div>
        </div>
      </div>

      {/* Top tabs */}
      <div className="mt-5 px-4">
        <div className="flex gap-6 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setTopTab("trades")}
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
            className={
              topTab === "watchlist"
                ? "font-ibm text-[14px] text-white"
                : "font-ibm text-[14px] text-white/45"
            }
          >
            WatchList
          </button>
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
