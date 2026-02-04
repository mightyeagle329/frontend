import type { ReactNode } from "react";

/**
 * 3-layer prediction card frame (mobile) per Figma.
 */
export function PredictionFrame({ children }: { children?: ReactNode }) {
  return (
    <section className="relative h-[560px] w-full" aria-label="Prediction">
      <PredictionFrameBg />
      <PredictionFrameTop>{children}</PredictionFrameTop>
    </section>
  );
}

export function PredictionFrameBg() {
  return (
    <>
      {/* Final/back layer */}
      <div className="absolute left-[11px] top-[0px] h-[467px] w-[327px] rounded-[43px] bg-[#181818]" />

      {/* Middle layer */}
      <div className="absolute left-[22px] top-[13px] h-[487px] w-[341px] rounded-[43px] bg-[#3B3B3B]" />
    </>
  );
}

export function PredictionFrameTop({
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
        background:
          "linear-gradient(#060606, #060606) padding-box, linear-gradient(138.53deg, #24233E 3.27%, #6A64FF 20.73%, #1D1A57 45.42%, #C3C1FB 69.11%, #423F8F 97.18%) border-box",
        border: "4px solid transparent",
        ...style,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#060606]"
        style={{
          boxShadow:
            "inset 0px 2px 0.2px #FFFFFF40, inset 0px 4px 52.6px #FFFFFF26",
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
