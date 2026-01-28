"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconArrowRight } from "./icons";
import { BuyYesSheet } from "./BuyYesSheet";

type BgLayer = {
  left: number;
  top: number;
  w: number;
  h: number;
  r: number;
  color: string;
  opacity: number;
};

function LayerBg({
  back,
  mid,
}: {
  back: BgLayer;
  mid: BgLayer;
}) {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: back.left,
          top: back.top,
          width: back.w,
          height: back.h,
          borderRadius: back.r,
          background: back.color,
          opacity: back.opacity,
        }}
      />
      <div
        className="absolute"
        style={{
          left: mid.left,
          top: mid.top,
          width: mid.w,
          height: mid.h,
          borderRadius: mid.r,
          background: mid.color,
          opacity: mid.opacity,
        }}
      />
    </>
  );
}

type Stage = "center" | "yes" | "no";

export function PredictionSwipeOverlay({
  onClose,
  frame,
  center,
}: {
  onClose: () => void;
  /** Which frame background offsets to use for the 3-layer stack behind cards. */
  frame: "analytics" | "prediction";
  /** The content rendered inside the MAIN (center) card. */
  center: ReactNode;
}) {
  // Carousel layout within the 402px app frame
  const frameW = 402;
  const top = 148;
  const cardW = 343;
  const cardH = 495;
  const gap = 20; // spacing between cards when sliding
  const centerLeft = (frameW - cardW) / 2; // 29.5

  const stageIndex = (s: Stage) => (s === "no" ? 0 : s === "center" ? 1 : 2);

  const [stage, setStage] = useState<Stage>("center");
  const [dragging, setDragging] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const [translateX, setTranslateX] = useState(() => centerLeft - 1 * (cardW + gap));
  const [buyYesOpen, setBuyYesOpen] = useState(false);

  const dragStartRef = useRef<{ x: number; baseTranslate: number } | null>(null);
  const downCardRef = useRef<Stage | null>(null);

  const clampTranslate = (next: number) => {
    const min = centerLeft - 2 * (cardW + gap); // YES centered
    const max = centerLeft - 0 * (cardW + gap); // NO centered
    return Math.max(min, Math.min(max, next));
  };

  const snapToStage = (next: Stage) => {
    setStage(next);
    setTranslateX(centerLeft - stageIndex(next) * (cardW + gap));
  };

  const stageTranslate = (s: Stage) => centerLeft - stageIndex(s) * (cardW + gap);

  // Background layer geometry relative to the top card.
  // Derived from AnalyticsFrameBg/PredictionFrameBg offsets vs the top layer.
  const bg =
    frame === "analytics"
      ? {
          back: { left: 37, top: 0, w: 327, h: 467, r: 43, color: "#141426", opacity: 0.9 },
          mid: { left: 12, top: 13, w: 341, h: 487, r: 43, color: "#2C4A65", opacity: 1 },
        }
      : {
          back: { left: -24, top: 0, w: 327, h: 467, r: 43, color: "#171E2E", opacity: 1 },
          mid: { left: -13, top: 13, w: 341, h: 487, r: 43, color: "#2C4A65", opacity: 1 },
        };

  const isPointInAnyCard = (x: number, y: number) => {
    // Cards live inside the track at y=top..top+cardH, with x determined by translateX.
    if (y < top || y > top + cardH) return false;
    for (let i = 0; i < 3; i++) {
      const left = translateX + i * (cardW + gap);
      const right = left + cardW;
      if (x >= left && x <= right) return true;
    }
    return false;
  };

  const cardAtPoint = (x: number, y: number): Stage | null => {
    if (y < top || y > top + cardH) return null;
    for (let i = 0; i < 3; i++) {
      const left = translateX + i * (cardW + gap);
      const right = left + cardW;
      if (x >= left && x <= right) {
        return i === 0 ? "no" : i === 1 ? "center" : "yes";
      }
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (buyYesOpen) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    downCardRef.current = cardAtPoint(x, y);

    // If user taps/clicks outside the 3 cards, close overlay and return to the original page.
    if (!isPointInAnyCard(x, y)) {
      onClose();
      return;
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, baseTranslate: translateX };
    setDragDx(0);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (buyYesOpen) return;
    const s = dragStartRef.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    setDragDx(dx);
    // Updated behavior: swipe LEFT chooses YES, swipe RIGHT chooses NO.
    // The track follows the finger: drag left => translate decreases => YES comes into view.
    setTranslateX(clampTranslate(s.baseTranslate + dx));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (buyYesOpen) return;
    const s = dragStartRef.current;
    dragStartRef.current = null;
    setDragging(false);
    if (!s) return;
    const dx = e.clientX - s.x;
    const clickThreshold = 10;

    // Tap on YES card (when YES is active) opens the buy sheet.
    // This avoids pointer-capture blocking click on desktop, and still allows swiping.
    if (Math.abs(dx) < clickThreshold && downCardRef.current === "yes" && stage === "yes") {
      setBuyYesOpen(true);
      setDragDx(0);
      return;
    }

    // Step-wise navigation (no skipping over center):
    // Use the dragged translateX to decide the next stage so it feels consistent
    // on both mobile and desktop.
    const nextTranslate = clampTranslate(s.baseTranslate + dx);
    const step = cardW + gap;
    const commit = step * 0.33; // how far you need to drag to commit a step

    if (stage === "no") {
      // only NO -> CENTER
      if (nextTranslate < stageTranslate("no") - commit) snapToStage("center");
      else snapToStage("no");
    } else if (stage === "center") {
      // CENTER -> YES or NO
      if (nextTranslate < stageTranslate("center") - commit) snapToStage("yes");
      else if (nextTranslate > stageTranslate("center") + commit) snapToStage("no");
      else snapToStage("center");
    } else {
      // YES -> CENTER
      if (nextTranslate > stageTranslate("yes") + commit) snapToStage("center");
      else snapToStage("yes");
    }

    // Reset drag delta so hint/arrow revert to stage-based UI.
    setDragDx(0);
    downCardRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[60] mx-auto w-full max-w-[402px]"
      aria-label="Swipe selector"
    >
      {/* Backdrop (click outside closes) */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Swipe area */}
      <div
        className="absolute inset-0 overflow-hidden touch-none select-none"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* YES buy sheet (opens when tapping the YES card) */}
        {buyYesOpen ? (
          <div className="absolute inset-0 z-[70] bg-black/70 backdrop-blur-sm">
            <BuyYesSheet onClose={() => setBuyYesOpen(false)} />
          </div>
        ) : null}

        {/* Track: NO | MAIN | YES */}
        <div
          className={
            dragging
              ? "relative"
              : "relative transition-transform duration-700 ease-out"
          }
          style={{
            transform: `translate3d(${translateX}px, ${top}px, 0)`,
            width: `${3 * cardW + 2 * gap}px`,
            height: `${cardH}px`,
          }}
        >
          {/* NO */}
          <div className="absolute left-0 top-0 h-[495px] w-[343px]">
            <div className="relative h-full w-full overflow-visible">
              <LayerBg back={bg.back} mid={bg.mid} />
              <div
                className="absolute left-0 top-0 h-[495px] w-[343px] rounded-[38px]"
                style={{
                  background:
                    "linear-gradient(90deg, #000000 29.01%, #E83D36 102.48%)",
                }}
              >
                <div className="grid h-full w-full place-items-center font-ibm text-[56px] font-semibold tracking-wide text-white">
                  NO
                </div>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div
            className="absolute top-0 h-[495px] w-[343px]"
            style={{ left: `${cardW + gap}px` }}
          >
            <div className="relative h-full w-full overflow-visible">
              <LayerBg back={bg.back} mid={bg.mid} />
              <div
                className="absolute left-0 top-0 h-[495px] w-[343px] rounded-[38px] p-[4px]"
                style={{
                  background:
                    "linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #BA22E5 78.12%)",
                  boxShadow:
                    "inset 0px 2px 0.2px rgba(255,255,255,0.25), inset 0px 4px 52.6px rgba(255,255,255,0.31), 0px 4px 136.3px rgba(133,248,72,1)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#05011C]">
                  {center}
                </div>
              </div>
            </div>
          </div>

          {/* YES */}
          <div
            className="absolute top-0 h-[495px] w-[343px]"
            style={{ left: `${2 * (cardW + gap)}px` }}
          >
            <div className="relative h-full w-full overflow-visible">
              <LayerBg back={bg.back} mid={bg.mid} />
              <div
                className="absolute left-0 top-0 h-[495px] w-[343px] rounded-[38px]"
                style={{
                  background:
                    "linear-gradient(270deg, #000000 29.01%, #85F848 102.48%)",
                }}
              >
                <div className="grid h-full w-full place-items-center font-ibm text-[56px] font-semibold tracking-wide text-white">
                  YES
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helper UI */}
        {(() => {
          // Requested guidance:
          // - center/no: swipe left progresses toward YES
          // - yes: swipe right progresses toward NO
          const hint =
            stage === "yes" ? "Swipe right to choose NO" : "Swipe left to choose YES";

          const dir: "left" | "right" = stage === "yes" ? "right" : "left";

          return (
            <>
              <div className="absolute left-[177px] top-[679px] grid h-[44px] w-[44px] place-items-center rounded-full bg-[#3EB8FF]">
                <IconArrowRight
                  className={
                    ((dragging ? (dragDx >= 0 ? "right" : "left") : dir) ===
                    "right")
                      ? "h-6 w-6 text-white"
                      : "h-6 w-6 -scale-x-100 text-white"
                  }
                />
              </div>

              <div className="absolute left-[27px] top-[732px] w-[357px] text-center font-ibm text-[27px] font-semibold leading-[28px]">
                {hint}
              </div>
            </>
          );
        })()}

        <div className="absolute left-[180px] top-[780px] flex items-center gap-[7px]">
          <span
            className={
              stage === "no"
                ? "h-[9px] w-[9px] rounded-full bg-white"
                : "h-[9px] w-[9px] rounded-full bg-white/50"
            }
          />
          <span
            className={
              stage === "center"
                ? "h-[9px] w-[9px] rounded-full bg-white"
                : "h-[9px] w-[9px] rounded-full bg-white/50"
            }
          />
          <span
            className={
              stage === "yes"
                ? "h-[9px] w-[9px] rounded-full bg-white"
                : "h-[9px] w-[9px] rounded-full bg-white/50"
            }
          />
        </div>
      </div>
    </div>
  );
}
