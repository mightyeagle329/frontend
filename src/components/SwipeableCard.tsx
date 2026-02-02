"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Swipe horizontally to change the *content* of the current card.
 * This keeps the card/frame design intact, but animates between different datasets.
 */
export function SwipeableCard<T>({
  items,
  render,
  background,
  onTap,
  loop = true,
  /**
   * If true, swiping either left OR right advances to the next item (deck-rotation feel).
   * If false, left=next and right=prev.
   */
  advanceOnAnySwipe = false,
  index,
  onIndexChange,
  swipeThreshold = 90,
  tapThreshold = 10,
  height = 560,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  /** Static (non-moving) background behind the swipeable top card. */
  background?: ReactNode;
  onTap?: () => void;
  loop?: boolean;
  advanceOnAnySwipe?: boolean;
  /** Controlled index (optional). */
  index?: number;
  /** Index change callback when controlled. */
  onIndexChange?: (next: number) => void;
  swipeThreshold?: number;
  tapThreshold?: number;
  /** Reserved height for the swipe area (should match the frame height). */
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(402);

  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = index ?? internalIndex;
  const [dragging, setDragging] = useState(false);
  const [dx, setDx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const dragRef = useRef<{ x: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width || 402);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = items.length;

  const getIndex = (i: number) => {
    if (count === 0) return 0;
    return loop ? mod(i, count) : Math.max(0, Math.min(count - 1, i));
  };

  const current = items[getIndex(activeIndex)];
  const next = items[getIndex(activeIndex + 1)];

  // Deck feel: next card is always the one "under" the top.
  const under = next;

  const transition = dragging || !animating ? "none" : "transform 280ms ease-out";

  const allowSwipeFromTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return true;
    return !target.closest("[data-noswipe]");
  };

  const triggerTap = (target: EventTarget | null) => {
    // Desktop fallback: if pointer-events are finicky, allow a normal click to open overlay.
    // Respect data-noswipe so buttons (like Refresh) don't trigger the overlay.
    if (!onTap) return;
    if (!allowSwipeFromTarget(target)) return;
    if (dragging || animating) return;
    onTap();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!allowSwipeFromTarget(e.target)) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX };
    setDragging(true);
    setAnimating(false);
    setDx(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragRef.current;
    if (!s) return;
    setDx(e.clientX - s.x);
  };

  const commit = (dir: "next" | "prev", swipeDir: "left" | "right") => {
    setAnimating(true);
    // Move the top card offscreen in the swipe direction.
    setDx(swipeDir === "left" ? -width : width);
    window.setTimeout(() => {
      const nextIndex = getIndex(dir === "next" ? activeIndex + 1 : activeIndex - 1);
      if (onIndexChange) onIndexChange(nextIndex);
      else setInternalIndex(nextIndex);
      setAnimating(false);
      setDx(0);
    }, 280);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!s) return;

    const d = e.clientX - s.x;
    const abs = Math.abs(d);

    if (abs <= tapThreshold) {
      onTap?.();
      setDx(0);
      return;
    }

    if (d <= -swipeThreshold) {
      // swipe left
      if (loop || activeIndex < count - 1) commit("next", "left");
      else {
        setAnimating(true);
        setDx(0);
        window.setTimeout(() => setAnimating(false), 280);
      }
    } else if (d >= swipeThreshold) {
      // swipe right
      if (advanceOnAnySwipe) {
        if (loop || activeIndex < count - 1) commit("next", "right");
        else {
          setAnimating(true);
          setDx(0);
          window.setTimeout(() => setAnimating(false), 280);
        }
      } else if (loop || activeIndex > 0) {
        commit("prev", "right");
      } else {
        setAnimating(true);
        setDx(0);
        window.setTimeout(() => setAnimating(false), 280);
      }
    } else {
      setAnimating(true);
      setDx(0);
      window.setTimeout(() => setAnimating(false), 280);
    }
  };

  const resetGesture = () => {
    dragRef.current = null;
    setDragging(false);
    setAnimating(false);
    setDx(0);
  };

  const onPointerCancel = () => {
    // Mobile browsers may cancel pointers when the page scrolls or the gesture is interrupted.
    // If we don't reset state here, subsequent taps (e.g. the reverse button) can behave oddly.
    resetGesture();
  };

  const onLostPointerCapture = () => {
    resetGesture();
  };

  const content = useMemo(() => {
    if (!current) return null;
    return render(current);
  }, [current, render]);

  const underContent = useMemo(() => {
    if (!under) return null;
    return render(under);
  }, [under, render]);

  const progress = Math.min(1, Math.max(0, Math.abs(dx) / swipeThreshold));
  const underScale = 0.96 + 0.04 * progress;
  const underY = 14 - 14 * progress;
  const underOpacity = 0.85 + 0.15 * progress;
  const underVisible = dragging && Math.abs(dx) > tapThreshold;

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onLostPointerCapture}
      onClick={(e) => triggerTap(e.target)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") triggerTap(e.target);
      }}
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      aria-label="Swipeable card"
    >
      <div className="relative overflow-hidden">
        {/* Static background (should NOT move when swiping). */}
        {background ? (
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
            {background}
          </div>
        ) : null}

        {/* Under card: only show WHILE actively swiping (avoid always-looking-like a 2nd card) */}
        {underVisible ? (
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(0, ${underY}px, 0) scale(${underScale})`,
              opacity: underOpacity,
              transition,
              zIndex: 1,
            }}
          >
            {underContent}
          </div>
        ) : null}

        {/* Top card */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(${dx}px, 0, 0) rotate(${dx / 60}deg)`,
            transition,
            zIndex: 2,
          }}
        >
          {content}
        </div>

        {/* Height spacer (cards are absolutely positioned internally) */}
        <div style={{ height }} />
      </div>
    </div>
  );
}
