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
      {/* Final/back layer */}
      <div className="absolute left-[72px] top-[0px] h-[467px] w-[327px] rounded-[43px] bg-[#181818]" />

      {/* Middle layer */}
      <div className="absolute left-[47px] top-[13px] h-[487px] w-[341px] rounded-[43px] bg-[#3B3B3B]" />
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
      className="absolute left-[35px] top-[24px] h-[495px] w-[343px] rounded-[38px]"
      style={{
        // 4px border with gradient (design update)
        background:
          "linear-gradient(#060606, #060606) padding-box, linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #E96023 78.12%) border-box",
        border: "4px solid transparent",
        ...style,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#060606]"
        style={{
          boxShadow:
            "inset 0px 0px 0.2px #FFFFFF40, inset 0px 4px 52.6px #FFFFFF26",
        }}
      >
        {/* Bottom edge highlight under the border (subtle band) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 55%, rgba(255,255,255,0) 100%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
