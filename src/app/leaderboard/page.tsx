"use client";

import { BottomNav } from "@/components/BottomNav";
import { HomeHeader } from "@/components/HomeHeader";
import { useEffect, useRef, useState } from "react";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"volume" | "pnl" | "points">("volume");

  const tabsWrapRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<"volume" | "pnl" | "points", HTMLButtonElement | null>>({
    volume: null,
    pnl: null,
    points: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(
    { left: 0, width: 95 },
  );

  const computeIndicator = () => {
    const wrap = tabsWrapRef.current;
    const btn = tabRefs.current[tab];
    if (!wrap || !btn) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - wrapRect.left,
      width: btnRect.width,
    });
  };

  useEffect(() => {
    computeIndicator();
    const onResize = () => computeIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden pb-24"
      style={{
        backgroundImage:
          "radial-gradient(900px 420px at 50% -120px, rgba(45, 212, 191, 0.20), transparent 60%), radial-gradient(700px 480px at 70% 45%, rgba(217, 70, 239, 0.18), transparent 60%), radial-gradient(900px 560px at 20% 80%, rgba(56, 189, 248, 0.10), transparent 55%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75))]" />

      <main className="relative">
        <div className="px-0 pt-6">
          <HomeHeader />
        </div>

        <div className="px-4">
          {/* Tabs + underline spec */}
          <div className="relative mt-4 h-[28px]">
            <div className="absolute left-1/2 top-0 w-[366px] -translate-x-1/2">
              <div ref={tabsWrapRef} className="relative w-[366px]">
                <div className="flex gap-8">
                  <button
                    type="button"
                    onClick={() => setTab("volume")}
                    ref={(el) => {
                      tabRefs.current.volume = el;
                    }}
                    className={
                      tab === "volume"
                        ? "font-ibm text-[14px] font-medium text-white"
                        : "font-ibm text-[14px] font-medium text-white/55"
                    }
                  >
                    Volume Whales
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("pnl")}
                    ref={(el) => {
                      tabRefs.current.pnl = el;
                    }}
                    className={
                      tab === "pnl"
                        ? "font-ibm text-[14px] font-medium text-white"
                        : "font-ibm text-[14px] font-medium text-white/55"
                    }
                  >
                    P&L Winners
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("points")}
                    ref={(el) => {
                      tabRefs.current.points = el;
                    }}
                    className={
                      tab === "points"
                        ? "font-ibm text-[14px] font-medium text-white"
                        : "font-ibm text-[14px] font-medium text-white/55"
                    }
                  >
                    Points Earners
                  </button>
                </div>

                {/* Full line */}
                <div className="relative mt-[6px] h-px w-[366px] bg-white/25">
                  {/* Selected underline: change color under selected tab */}
                  <div
                    className="absolute left-0 top-0 h-px bg-white transition-[left,width] duration-300 ease-out"
                    style={{
                      left: indicator.left,
                      width: indicator.width,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center gap-3">
            <Pill active>All time</Pill>
            <Pill>30d</Pill>
            <Pill>7d</Pill>
            <Pill>24h</Pill>
          </div>

          {/* Top 3 (pixel-based)
              Podium positions are based on the full 402px frame.
              Cancel the page's px-4 so left/right margins match the design. */}
          <div className="relative mt-6 -mx-4 h-[190px]">
            <PodiumTop3 />
          </div>

          {/* Table header */}
          <div className="mt-2 flex items-center justify-between text-[12px] text-white/45">
            <span>Rank User</span>
            <span>Volume</span>
          </div>

          {/* Divider line under header: 367px @ (17,480), opacity 0.1 */}
          <div className="mt-3 h-px w-[367px] bg-white/10" />

          {/* Rows */}
          <div className="mt-3 space-y-3">
            {[
              { rank: 4, name: "Big_Winner", vol: "$80.81M" },
              { rank: 5, name: "Dragon1", vol: "$72.13M" },
              { rank: 6, name: "MasterNO", vol: "$71.99M" },
              { rank: 7, name: "WALLACE", vol: "$68.00M" },
              { rank: 8, name: "chupakabra", vol: "$66.26M" },
              { rank: 9, name: "mmmmmmmm", vol: "$58.43M" },
            ].map((r) => (
              <Row key={r.rank} rank={r.rank} name={r.name} vol={r.vol} />
            ))}

            <div className="mt-4 flex items-center justify-between rounded-full bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="w-[28px] text-center font-ibm text-[14px] text-white/70">
                  137
                </div>
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-fuchsia-500/60 to-cyan-400/40" />
                <div className="font-ibm text-[14px] text-white">You</div>
                <div className="font-ibm text-[14px] font-medium text-[#49F347]">
                  +346% ↑
                </div>
              </div>
              <div className="font-ibm text-[14px] text-white">$3.5M</div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Pill({ children, active }: { children: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={
        active
          ? "rounded-full bg-[#E96023] px-4 py-2 font-ibm text-[13px] text-white"
          : "rounded-full bg-white/10 px-4 py-2 font-ibm text-[13px] text-white/85"
      }
    >
      {children}
    </button>
  );
}

function PodiumTop3() {
  return (
    <div className="relative h-full w-full">
      {/* #3 - Purple */}
      <div
        className="absolute left-[19px] top-[83px] h-[85px] w-[118px] rounded-[20px]"
        style={{ background: "#A10FCA42" }}
      />
      <div
        className="absolute left-[50px] top-[47px] h-[56px] w-[56px] rounded-full border-2 border-white"
        style={{ boxShadow: "0px 3px 30.7px 0px #A10FCAA6" }}
      />
      <div className="absolute left-[63px] top-[83px] grid h-[30px] w-[30px] place-items-center rounded-full bg-[#A10FCA] font-ibm text-[16px] font-semibold text-white">
        3
      </div>
      <div className="absolute left-[47px] top-[117px] w-[64px] text-center font-ibm leading-[20px] text-white">
        <div className="text-[19px] font-bold">reikd</div>
        <div className="text-[15px] font-normal text-white/70">$309.49M</div>
      </div>

      {/* #1 - Gold */}
      <div
        className="absolute left-[143px] top-[33px] h-[135px] w-[117px] rounded-[20px]"
        style={{ background: "#D6A22A38" }}
      />
      <div
        className="absolute left-[166px] top-[0px] h-[70px] w-[70px] rounded-full border-[4px] border-[#D6A22A]"
        style={{ boxShadow: "0px 3px 30.7px 0px #D6A22A99" }}
      />
      <div className="absolute left-[186px] top-[55px] grid h-[30px] w-[30px] place-items-center rounded-full bg-[#D6A22A] font-ibm text-[16px] font-semibold text-white">
        1
      </div>
      <div className="absolute left-[170px] top-[117px] w-[64px] text-center font-ibm leading-[20px] text-white">
        <div className="text-[19px] font-bold">Beoakd</div>
        <div className="text-[15px] font-normal text-white/70">$529.20M</div>
      </div>

      {/* #2 - Blue */}
      <div
        className="absolute left-[266px] top-[65px] h-[103px] w-[118px] rounded-[20px]"
        style={{ background: "#2882D126" }}
      />
      <div
        className="absolute left-[293px] top-[31px] h-[64px] w-[64px] rounded-full border-[3px] border-[#2882D1]"
        style={{ boxShadow: "0px 3px 30.7px 0px #2882D1" }}
      />
      <div className="absolute left-[310px] top-[78px] grid h-[30px] w-[30px] place-items-center rounded-full bg-[#2882D1] font-ibm text-[16px] font-semibold text-white">
        2
      </div>
      <div className="absolute left-[294px] top-[118px] w-[64px] text-center font-ibm leading-[20px] text-white">
        <div className="text-[19px] font-bold">chealce</div>
        <div className="text-[15px] font-normal text-white/70">$529.20M</div>
      </div>
    </div>
  );
}

function Row({
  rank,
  name,
  vol,
}: {
  rank: number;
  name: string;
  vol: string;
}) {
  return (
    <div className="flex items-center justify-between text-white/80">
      <div className="flex items-center gap-3">
        <div className="w-[18px] text-center font-ibm text-[13px] text-white/35">
          {rank}
        </div>
        <div className="h-7 w-7 rounded-full bg-white/10" />
        <div className="font-ibm text-[14px]">{name}</div>
      </div>
      <div className="font-ibm text-[14px] text-white/45">{vol}</div>
    </div>
  );
}
