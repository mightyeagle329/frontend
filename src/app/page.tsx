"use client";

import { BottomNav } from "@/components/BottomNav";
import { HomeHeader } from "@/components/HomeHeader";
import { MarketTicker } from "@/components/MarketTicker";
import { SearchBar } from "@/components/SearchBar";
import { AnalyticsFrameBg, AnalyticsFrameTop } from "@/components/AnalyticsFrame";
import { AnalyticsContent, type AnalyticsCardData } from "@/components/AnalyticsContent";
import { PredictionFrameBg, PredictionFrameTop } from "@/components/PredictionFrame";
import { PredictionContent, type PredictionCardData } from "@/components/PredictionContent";
import { PredictionSwipeOverlay } from "@/components/PredictionSwipeOverlay";
import { SwipeableCard } from "@/components/SwipeableCard";

import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";

function makeRng(seed: number) {
  // Deterministic PRNG (LCG) to keep render pure.
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildDemoAnalytics(count: number, seed: number): AnalyticsCardData[] {
  const rnd = makeRng(seed);
  const pairs = ["PEPE/USDT BINARY", "BTC/USDT BINARY", "ETH/USDT BINARY"];
  const titles = ["Pro Market Analytics", "Market Pulse", "Trend Scanner"];
  return Array.from({ length: count }, () => {
    const yes = 40 + Math.floor(rnd() * 21);
    const no = 100 - yes;
    const price = (200 + rnd() * 900).toFixed(2);
    return {
      pairLabel: pairs[Math.floor(rnd() * pairs.length)],
      title: titles[Math.floor(rnd() * titles.length)],
      price: `$${price}`,
      noPct: no,
      yesPct: yes,
    };
  });
}

function buildDemoPrediction(count: number, seed: number): PredictionCardData[] {
  const rnd = makeRng(seed);
  const tokens = ["$PEPE", "$BTC", "$ETH"];
  return Array.from({ length: count }, () => {
    const tokenLabel = tokens[Math.floor(rnd() * tokens.length)];
    const questions = [
      `Will ${tokenLabel} break the ATH before midnight?`,
      `Will ${tokenLabel} go up in the next hour?`,
      `Is ${tokenLabel} ending green today?`,
    ];
    const vibesPct = 50 + Math.floor(rnd() * 41);
    const pool = `$${(
      200000 + Math.floor(rnd() * 900000)
    ).toLocaleString()}`;
    return {
      tokenLabel,
      question: questions[Math.floor(rnd() * questions.length)],
      pool,
      vibesPct,
      backgroundSrc: "/icons/bg_prediction.png",
    };
  });
}

function getSeedFromCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )demoSeed=(\d+)/);
  return m ? Number(m[1]) : null;
}

function setSeedCookie(seed: number) {
  if (typeof document === "undefined") return;
  document.cookie = `demoSeed=${seed}; path=/; max-age=31536000; samesite=lax`;
}

export default function Home() {
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Track which dataset is shown for each face, so swiping changes the current face's content
  // without accidentally switching to the other face.
  const [analyticsIndex, setAnalyticsIndex] = useState(0);
  const [predictionIndex, setPredictionIndex] = useState(0);

  // Demo data seed must be identical on server & client to avoid hydration mismatch.
  // We seed from a stable cookie if present; otherwise fall back to a constant.
  // Client can later set the cookie (once) for future navigations.
  const [seed] = useState(() => 123456);

  useEffect(() => {
    const existing = getSeedFromCookie();
    if (existing != null) return;
    // Set once for future loads. (We intentionally do NOT update state here.)
    setSeedCookie(Math.floor(Date.now() % 1_000_000_000));
  }, []);

  const analyticsItems = useMemo(
    () => buildDemoAnalytics(4, seed),
    [seed],
  );
  const predictionItems = useMemo(
    () => buildDemoPrediction(4, seed + 1337),
    [seed],
  );

  const openSwipe = () => setSwipeOpen(true);

  // Search is now always visible; keep ref for future enhancements.

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden pb-24"
      style={{
        // Use bg.gif behind the whole page (bottom nav remains solid due to fixed bg).
        backgroundImage: "url(/icons/bg.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75))]" />

      <main className="relative">
        <div className="px-0 pt-6">
          <HomeHeader />
        </div>

        <div className="px-4">
          <div className="mt-4">
            <MarketTicker />
          </div>

          {/* Replace category pills with always-visible big search bar */}
          <div className="mt-4 -mx-4 px-[18px]" ref={searchContainerRef}>
            <SearchBar autoFocus={false} />
          </div>

          {/* Analytics frame uses absolute left offsets from the 402px frame.
              Cancel the page's px-4 so those offsets line up, and keep enough top spacing to avoid overlap. */}
          <div className="mt-2 -mx-4">
            {predictionOpen ? (
              <section className="relative h-[560px] w-full" aria-label="Prediction">
                <PredictionFrameBg />
                <SwipeableCard
                  height={560}
                  items={predictionItems}
                  index={predictionIndex}
                  onIndexChange={setPredictionIndex}
                  onTap={openSwipe}
                  render={(item) => (
                    <PredictionFrameTop>
                      <PredictionCard
                        onToggle={() => setPredictionOpen(false)}
                        onOpenSwipe={openSwipe}
                        data={item}
                      />
                    </PredictionFrameTop>
                  )}
                />
              </section>
            ) : (
              <section className="relative h-[520px] w-full" aria-label="Analytics">
                <AnalyticsFrameBg />
                <SwipeableCard
                  height={520}
                  items={analyticsItems}
                  index={analyticsIndex}
                  onIndexChange={setAnalyticsIndex}
                  onTap={openSwipe}
                  render={(item) => (
                    <AnalyticsFrameTop>
                      <AnalyticsCard
                        onToggle={() => setPredictionOpen(true)}
                        onOpenSwipe={openSwipe}
                        data={item}
                      />
                    </AnalyticsFrameTop>
                  )}
                />
              </section>
            )}
          </div>
        </div>
      </main>

      <BottomNav />

      {swipeOpen ? (
        <PredictionSwipeOverlay
          onClose={() => setSwipeOpen(false)}
          center={
            predictionOpen ? (
              <PredictionContent onToggle={() => setPredictionOpen(false)} />
            ) : (
              <AnalyticsContent onToggle={() => setPredictionOpen(true)} />
            )
          }
        />
      ) : null}
    </div>
  );
}

// Header is now in src/components/HomeHeader.tsx

// Asset cards replaced by MarketTicker
// Category pills replaced by CategoryRow

// AnalyticsCard / PredictionCard replaced by CardStack

function AnalyticsCard({
  onToggle,
  onOpenSwipe,
  data,
}: {
  onToggle?: () => void;
  onOpenSwipe: () => void;
  data: AnalyticsCardData;
}) {
  // Clicking the analytics card should open the YES/NO overlay (same as prediction face).
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenSwipe}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenSwipe();
      }}
      className="cursor-pointer"
      aria-label="Open swipe chooser"
    >
      <AnalyticsContent onToggle={onToggle} data={data} />
    </div>
  );
}

function PredictionCard({
  onToggle,
  onOpenSwipe,
  data,
}: {
  onToggle?: () => void;
  onOpenSwipe: () => void;
  data: PredictionCardData;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenSwipe}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenSwipe();
      }}
      className="cursor-pointer"
      aria-label="Open swipe chooser"
    >
      <PredictionContent onToggle={onToggle} data={data} />
    </div>
  );
}
