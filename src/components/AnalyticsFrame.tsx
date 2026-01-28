import type { ReactNode } from "react";

/**
 * 3-layer card frame (mobile) matching the Figma layer sizes.
 * Positions are absolute from the 402px-wide page frame.
 */
export function AnalyticsFrame({ children }: { children?: ReactNode }) {
  return (
    <section className="relative h-[520px] w-full" aria-label="Analytics">
      <AnalyticsFrameBg />
      <AnalyticsFrameTop>{children}</AnalyticsFrameTop>
    </section>
  );
}

export function AnalyticsFrameBg() {
  return (
    <>
      {/* Final/back layer: 327x467, r=43, left 72 */}
      <div className="absolute left-[72px] top-[0px] h-[467px] w-[327px] rounded-[43px] bg-[#141426] opacity-90" />

      {/* Middle layer: 341x487, bg #2C4A65, r=43, left 47 */}
      <div className="absolute left-[47px] top-[13px] h-[487px] w-[341px] rounded-[43px] bg-[#2C4A65]" />
    </>
  );
}

export function AnalyticsFrameTop({
  children,
  style,
}: {
  children?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute left-[35px] top-[24px] h-[495px] w-[343px] rounded-[38px] p-[4px]"
      style={{
        background:
          "linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #BA22E5 78.12%)",
        ...style,
      }}
    >
      <div
        className="h-full w-full overflow-hidden rounded-[34px] bg-[#05011C]"
        style={{
          boxShadow:
            "inset 0px 2px 0.2px rgba(255,255,255,0.25), inset 0px 4px 52.6px rgba(255,255,255,0.31)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
