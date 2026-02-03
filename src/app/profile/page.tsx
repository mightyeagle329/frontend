"use client";

import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/ProfileHeader";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function ProfilePage() {
  const [range, setRange] = useState<"1w" | "1m">("1w");
  const { disconnect } = useWallet();
  const [logoutStatus, setLogoutStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden pb-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75))]" />

      <main className="relative">
        {/* Match Home page top margin */}
        <div className="px-0 pt-6">
          <ProfileHeader />
        </div>

        <div className="px-4">
          {/* Top stats row */}
          <div className="mt-4 grid grid-cols-[1fr_1fr_1.1fr] gap-3">
            <StatCard title="FOLLOWERS" value="165" />
            <StatCard title="FOLLOWING" value="14" />
            <button
              type="button"
              className="rounded-[16px] bg-[#A10FCA] px-4 py-4 text-center font-ibm text-[13px] font-semibold shadow-[0px_2px_32.8px_0px_#A10FCAEB]"
            >
              REFERRAL
              <br />
              CODE
            </button>
          </div>

          {/* Net worth */}
          <div className="mt-5 flex items-end justify-between">
            <div className="font-ibm text-[14px] text-white/45">Net Worth</div>
            <div className="font-ibm text-[30px] font-semibold">$1,240.50</div>
          </div>

          {/* Volume / Profit cards */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-white/5 px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-ibm text-[12px] tracking-[0.11em] text-white/35">
                    VOLUME
                  </div>
                  <div className="mt-2 font-ibm text-[18px] font-semibold">
                    $5,200
                  </div>
                </div>
                <div className="text-right font-ibm text-[12px] text-white/45">
                  Rank
                  <div className="font-ibm text-[14px] font-semibold text-white">
                    #42
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] bg-white/5 px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-ibm text-[12px] tracking-[0.11em] text-white/35">
                    PROFIT
                  </div>
                  <div className="mt-2 font-ibm text-[18px] font-semibold text-[#49F347]">
                    +$240
                  </div>
                </div>
                <div className="text-right font-ibm text-[12px] text-white/45">
                  Rank
                  <div className="font-ibm text-[14px] font-semibold text-white">
                    #12
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Range pills */}
          <div className="mt-4 flex gap-3">
            <Pill active={range === "1w"} onClick={() => setRange("1w")}
              >1W</Pill
            >
            <Pill active={range === "1m"} onClick={() => setRange("1m")}
              >1M</Pill
            >
          </div>

          {/* Category Distribution */}
          <div className="mt-4 rounded-[16px] bg-white/5 px-4 py-4">
            <div className="font-ibm text-[16px] font-semibold">
              Category Distribution
            </div>

            <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-3">
              {/* Mini bar chart */}
              <div className="flex h-[90px] items-end gap-2">
                <div className="h-[50px] w-[34px] rounded-[8px] bg-[#A10FCA]" />
                <div className="h-[80px] w-[34px] rounded-[8px] bg-[#49F347]" />
                <div className="h-[40px] w-[34px] rounded-[8px] bg-[#68AAE4]" />
                <div className="h-[55px] w-[34px] rounded-[8px] bg-[#F7E222]" />
                <div className="h-[18px] w-[34px] rounded-[8px] bg-[#8B5CF6]" />
              </div>

              {/* Legend */}
              <div className="space-y-2 text-[13px] text-white/55">
                <LegendItem color="#A10FCA" label="Sports" />
                <LegendItem color="#49F347" label="Crypto" />
                <LegendItem color="#68AAE4" label="Politics" />
                <LegendItem color="#F7E222" label="Business" />
                <LegendItem color="#8B5CF6" label="Entertainment" />
              </div>
            </div>
          </div>

          {/* Terms of Use */}
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-[16px] bg-white/5 px-4 py-4"
          >
            <div className="h-5 w-5 rounded bg-white/15" />
            <div className="font-ibm text-[14px] font-semibold">Terms of Use</div>
          </button>

          {/* Log out */}
          <button
            type="button"
            onClick={async () => {
              try {
                setLogoutStatus("loading");
                await disconnect();
                setLogoutStatus("success");
                window.setTimeout(() => setLogoutStatus("idle"), 1500);
              } catch {
                setLogoutStatus("error");
                window.setTimeout(() => setLogoutStatus("idle"), 2000);
              }
            }}
            className="mt-4 w-full rounded-[16px] bg-white/5 px-4 py-4 text-center font-ibm text-[14px] font-semibold"
          >
            {logoutStatus === "loading"
              ? "Logging out…"
              : logoutStatus === "success"
                ? "Logged out"
                : logoutStatus === "error"
                  ? "Failed to log out"
                  : "Log out"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-white/5 px-4 py-4 text-center">
      <div className="font-ibm text-[18px] font-semibold">{value}</div>
      <div className="mt-1 font-ibm text-[11px] tracking-[0.11em] text-white/45">
        {title}
      </div>
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[6px] w-[6px] rounded-full" style={{ background: color }} />
      <span className="font-ibm">{label}</span>
    </div>
  );
}
