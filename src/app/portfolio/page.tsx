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
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden pb-24 text-white"
      style={{ backgroundColor: "#131131" }}
    >
      {/* Header card (pixel-based, matching Figma Group 62) */}
      <div className="relative h-[320px]">
        {/* Outer gradient card (Rectangle 33) */}
        <div
          className="glow-card-border absolute left-[18px] top-[66px] h-[230px] w-[366px] rounded-[33px]"
          style={{
            background:
              "linear-gradient(156.82deg, #0B092A 47.69%, #090635 107.22%) padding-box, linear-gradient(138.53deg, #24233E 3.27%, #6A64FF 20.73%, #1D1A57 45.42%, #C3C1FB 69.11%, #423F8F 97.18%) border-box",
            border: "2px solid transparent",
            boxShadow: "1px -6px 72.5px 0px #A39FF21F inset",
          }}
        />

        {/* Inner radial glow layer (Rectangle 37) */}
        <div
          className="absolute left-[21px] top-[70px] h-[224px] w-[360px] rounded-[31px]"
          style={{
            background:
              "radial-gradient(99.66% 121.87% at 12.22% 8.48%, rgba(119,0,255,0.46) 0%, rgba(21,19,62,0) 100%)",
            border: "1px solid transparent",
            boxShadow:
              "0px 35px 46.3px 0px #4742B475, 0px 0px 0px 1px transparent",
          }}
        />

        {/* Plus-lighter background texture (header-card.jpg) */}
        <Image
          src="/icons/header-card.jpg"
          alt="Balance card glow"
          width={359}
          height={202}
          className="pointer-events-none absolute left-[22px] top-[92px] h-[202px] w-[359px] object-cover"
          style={{
            opacity: 0.31,
            mixBlendMode: "plus-lighter",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />

        {/* Horizontal divider line under header (Line 14) */}
        <div
          className="pointer-events-none absolute left-[20px] top-[137px] h-px w-[362px]"
          style={{
            background:
              "linear-gradient(90deg, #6862F8 0%, #948FFF 29.62%, #FFFFFF 45.45%, #1B1849 71.16%, #A9A6E2 100%)",
          }}
        />

        {/* balance icon (balance-green.svg) */}
        <div
          className="absolute left-[42px] top-[92px]"
          style={{ filter: "drop-shadow(0px 1px 13.6px #3EB8FF)" }}
        >
          <div className="relative h-[18px] w-[21px] overflow-visible text-[#4DE6B8]">
            <Image
              src="/icons/balance.svg"
              alt="Balance spot"
              fill
              className="origin-center scale-[2.2] object-contain"
            />
          </div>
        </div>

        {/* BALANCE SPOT text */}
        <div className="absolute left-[68px] top-[92px] h-[20px] w-[140px] whitespace-nowrap font-ibm text-[15px] font-normal leading-[20px] tracking-[0.07em] text-[#4DE6B8]">
          BALANCE SPOT
        </div>

        {/* Amount */}
        <div className="absolute left-[236px] top-[82px] h-[38px] w-[126px] text-right font-ibm text-[29px] font-semibold leading-[29px] text-[#E1E0FF]">
          $4,206.91
        </div>

        {/* usdt.png token icon */}
        <div className="absolute left-[44px] top-[154px] h-[36px] w-[36px] rounded-full">
          <Image
            src="/icons/usdt.png"
            alt="USDT"
            width={36}
            height={36}
            className="h-full w-full rounded-full object-contain shadow-[0px_4px_5.7px_0px_#FFFFFF87_inset]"
          />
        </div>

        {/* USDT label */}
        <div className="absolute left-[96px] top-[152px] h-[20px] w-[60px] font-ibm text-[15px] font-bold leading-[20px] text-[#E1E0FF]">
          USDT
        </div>

        {/* 1,240.50 USDT */}
        <div className="absolute left-[96px] top-[172px] h-[20px] w-[120px] font-ibm text-[15px] font-normal leading-[20px] text-[#8682DF]">
          1,240.50 USDT
        </div>

        {/* Withdraw button (Group 61) with orbiting light effect */}
        <div className="absolute left-[44px] top-[216px] h-[53px] w-[156px]">
          <div className="withdraw-orbit pointer-events-none absolute inset-0 rounded-[16px]" />
          <button
            type="button"
            className="glow-button-border relative z-10 h-full w-full rounded-[16px] font-ibm text-[17px] font-bold leading-[20px] text-[#C7D3FF]"
            style={{
              background:
                "linear-gradient(180deg, #27055A 7.55%, #260657 100%) padding-box, linear-gradient(180deg, #6F13BF 0%, #936CE2 100%) border-box",
              border: "2px solid transparent",
              boxShadow:
                "0px 10px 17.5px -3px #3C0A88, inset 0px 3px 18px 9px #5727F294, 0px 1px 2.3px 0px #00000040",
            }}
            onClick={() => setWithdrawOpen(true)}
          >
            Withdraw
          </button>
        </div>

        {/* Deposit button (Group 60) */}
        <button
          type="button"
          className="glow-button-border absolute left-[206px] top-[216px] h-[53px] w-[156px] rounded-[16px] font-ibm text-[17px] font-bold leading-[20px] text-[#FFF2B9]"
          style={{
            background:
              "linear-gradient(180deg, #F68504 7.55%, #942700 100%)",
            border: "2px solid #FEE233",
            boxShadow:
              "0px 0px 17.5px -3px #FEE233, inset 0px 3px 9.2px 9px #FF5E00E5, 0px 1px 2.3px 0px #00000040",
          }}
          onClick={() => setDepositOpen(true)}
        >
          Deposit
        </button>
      </div>

      {/* Top tabs (Trades / WatchList) with dot + underline like design */}
      <div className="mt-1 px-4">
        <div className="relative w-full pb-3">
          <div
            ref={tabsWrapRef}
            className="relative flex items-start justify-center gap-8"
            style={{ height: 31 }}
          >
            <button
              type="button"
              onClick={() => setTopTab("trades")}
              ref={(el) => {
                tabRefs.current.trades = el;
              }}
              className="flex items-center gap-[6px] font-ibm text-[14px]"
            >
              <span
                className={
                  topTab === "trades"
                    ? "h-[7px] w-[7px] rounded-full bg-[#F19F2B]"
                    : "h-[7px] w-[7px] rounded-full bg-transparent"
                }
              />
              <span
                className={
                  topTab === "trades" ? "text-white" : "text-white/45"
                }
              >
                Trades
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTopTab("watchlist")}
              ref={(el) => {
                tabRefs.current.watchlist = el;
              }}
              className="flex items-center gap-[6px] font-ibm text-[14px]"
            >
              <span
                className={
                  topTab === "watchlist"
                    ? "h-[7px] w-[7px] rounded-full bg-[#F19F2B]"
                    : "h-[7px] w-[7px] rounded-full bg-transparent"
                }
              />
              <span
                className={
                  topTab === "watchlist" ? "text-white" : "text-white/45"
                }
              >
                WatchList
              </span>
            </button>

            {/* Full line: 354px, 1px white @ 20% */}
            <div className="absolute left-0 top-[31px] h-px w-[354px] bg-white/20" />

            {/* Selected underline aligned to selected word (like Leaderboard) */}
            <div
              className="absolute left-0 top-[31px] h-px bg-white transition-[left,width] duration-300 ease-out"
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

      <BottomNav variant="dark" />

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
          ? "flex h-[37px] min-w-[79px] items-center justify-center whitespace-nowrap rounded-[12.5px] px-4 font-ibm text-[13px] text-white"
          : "flex h-[37px] min-w-[79px] items-center justify-center whitespace-nowrap rounded-[12.5px] px-4 font-ibm text-[13px] text-white/85"
      }
      style={
        active
          ? {
              background:
                // Match visual style of Withdraw button, scaled to pill size
                "linear-gradient(180deg, #4C2BC3 0%, #2B145E 100%) padding-box, linear-gradient(180deg, #6F13BF 0%, #936CE2 100%) border-box",
              border: "1px solid transparent",
              boxShadow:
                "0px 6px 14px -2px #3C0A88, inset 0px 3px 12px 5px #5727F294",
            }
          : { background: "#1B1942" }
      }
    >
      {label}
    </button>
  );
}

function PositionCardYes() {
  return (
    <div
      className="mx-auto w-[380px] px-5 py-4"
      style={{
        height: 220,
        borderRadius: 16,
        background:
          "linear-gradient(180deg, #221F54 0%, #131131 100%)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#4EBC84]">
            YES POSITION
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold text-[#C7E1FF]">
            Bitcoin &gt; $100k?
          </div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[15px] text-[#4EBC84]">+12.00%</div>
          <div className="font-ibm text-[15px] text-[#8682DF]">P&L (Realized)</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#8682DF]">
            INITIAL STAKE
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold text-[#C7E1FF]">$100.00</div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#8682DF]">
            CURRENT VALUE
          </div>
          <div className="mt-1 font-ibm text-[15px] font-semibold text-[#4EBC84]">
            $112.00
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 mx-auto flex h-[45px] w-[337px] items-center justify-center rounded-[16px] font-ibm text-[17px] font-bold leading-[20px]"
        style={{ background: "#6761F126", color: "#C7E1FF" }}
      >
        Exit Position
      </button>
    </div>
  );
}

function PositionCardNo() {
  return (
    <div
      className="mx-auto w-[380px] border border-[#4C4899] px-5 py-4"
      style={{
        height: 220,
        borderRadius: 16,
        backgroundColor: "#131131",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#F45656]">
            NO POSITION
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold text-[#FFFFFF]">
            Tesla Earnings Beat?
          </div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[15px] text-[#F45656]">-4.00%</div>
          <div className="font-ibm text-[15px] text-[#8682DF]">P&L (Realized)</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#8682DF]">
            INITIAL STAKE
          </div>
          <div className="mt-1 font-ibm text-[18px] font-semibold text-[#FFFFFF]">$100.00</div>
        </div>
        <div className="text-right">
          <div className="font-ibm text-[15px] tracking-[0.11em] text-[#8682DF]">
            CURRENT VALUE
          </div>
          <div className="mt-1 font-ibm text-[15px] font-semibold text-[#F45656]">
            $96.00
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 mx-auto flex h-[45px] w-[337px] items-center justify-center rounded-[16px] font-ibm text-[17px] font-bold leading-[20px]"
        style={{ background: "#6761F126", color: "#C7E1FF" }}
      >
        Exit Position
      </button>
    </div>
  );
}
