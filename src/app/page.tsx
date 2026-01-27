"use client";

import { BottomNav } from "@/components/BottomNav";
import { HomeHeader } from "@/components/HomeHeader";
import { MarketTicker } from "@/components/MarketTicker";
import { CategoryRowBase } from "@/components/CategoryRow";
import { SearchBar } from "@/components/SearchBar";
import { AnalyticsFrame } from "@/components/AnalyticsFrame";
import { AnalyticsContent } from "@/components/AnalyticsContent";
import { PredictionFrame } from "@/components/PredictionFrame";
import { PredictionContent } from "@/components/PredictionContent";
import { PredictionSwipeOverlay } from "@/components/PredictionSwipeOverlay";

import { useState } from "react";
import { useEffect, useRef } from "react";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close search on Escape.
  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  // Close search when clicking outside of the big search bar.
  useEffect(() => {
    if (!searchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = searchContainerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden pb-24"
      style={{
        backgroundImage:
          "radial-gradient(900px 420px at 50% -120px, rgba(45, 212, 191, 0.20), transparent 60%), radial-gradient(700px 480px at 70% 45%, rgba(217, 70, 239, 0.18), transparent 60%), radial-gradient(900px 560px at 20% 80%, rgba(56, 189, 248, 0.10), transparent 55%), radial-gradient(circle at 20px 40px, rgba(255,255,255,0.18) 1px, transparent 2px), radial-gradient(circle at 200px 130px, rgba(255,255,255,0.12) 1px, transparent 2px), radial-gradient(circle at 120px 240px, rgba(255,255,255,0.10) 1px, transparent 2px), radial-gradient(circle at 320px 320px, rgba(255,255,255,0.10) 1px, transparent 2px)"
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75))]" />

      <main className="relative">
        <div className="px-0 pt-6">
          <HomeHeader />
        </div>

        <div className="px-4">
          {!searchOpen ? (
            <div className="mt-4">
              <MarketTicker />
            </div>
          ) : null}

          {/* CategoryRow is defined with exact px-based insets; cancel the page's px-4 so its edges align to the frame */}
          <div className="mt-4 -mx-4">
            {searchOpen ? (
              <>
                <div className="px-[18px]" ref={searchContainerRef}>
                  <SearchBar />
                </div>
                <div className="mt-3">
                  <CategoryRowBase hideSearch />
                </div>
              </>
            ) : (
              <CategoryRowBase onSearch={() => setSearchOpen(true)} />
            )}
          </div>

          {/* Analytics frame uses absolute left offsets from the 402px frame.
              Cancel the page's px-4 so those offsets line up, and keep enough top spacing to avoid overlap. */}
          <div className="mt-2 -mx-4">
            {predictionOpen ? (
              <PredictionCard
                onToggle={() => setPredictionOpen(false)}
                onOpenSwipe={() => setSwipeOpen(true)}
              />
            ) : (
              <AnalyticsCard onToggle={() => setPredictionOpen(true)} />
            )}
          </div>
        </div>
      </main>

      <BottomNav />

      {swipeOpen ? (
        <PredictionSwipeOverlay
          onClose={() => setSwipeOpen(false)}
          onToggle={() => setPredictionOpen((v) => !v)}
        />
      ) : null}
    </div>
  );
}

// Header is now in src/components/HomeHeader.tsx

// Asset cards replaced by MarketTicker
// Category pills replaced by CategoryRow

function AnalyticsCard({ onToggle }: { onToggle?: () => void }) {
  return (
    <AnalyticsFrame>
      <AnalyticsContent onToggle={onToggle} />
    </AnalyticsFrame>
  );
}

function PredictionCard({
  onToggle,
  onOpenSwipe,
}: {
  onToggle?: () => void;
  onOpenSwipe: () => void;
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
      <PredictionFrame>
        <PredictionContent onToggle={onToggle} />
      </PredictionFrame>
    </div>
  );
}
