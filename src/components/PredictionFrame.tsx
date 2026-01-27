import type { ReactNode } from "react";

/**
 * 3-layer prediction card frame (mobile) per Figma.
 */
export function PredictionFrame({ children }: { children?: ReactNode }) {
  return (
    <section className="relative h-[560px] w-full" aria-label="Prediction">
      {/* Final/back layer: 327x467 @ (11,244), bg #171E2E */}
      <div className="absolute left-[11px] top-[0px] h-[467px] w-[327px] rounded-[43px] bg-[#171E2E]" />

      {/* Middle layer: 341x487 @ (22,257), bg #2C4A65 */}
      <div className="absolute left-[22px] top-[13px] h-[487px] w-[341px] rounded-[43px] bg-[#2C4A65]" />

      {/* Top layer: 343x495 @ (35,268) with gradient border */}
      <div
        className="absolute left-[35px] top-[24px] h-[495px] w-[343px] rounded-[38px] p-[4px]"
        style={{
          background:
            "linear-gradient(145.87deg, #3EB8FF 10.14%, #69AAE3 45.99%, #BA22E5 78.12%)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#05011C]"
          style={{
            boxShadow:
              "inset 0px 2px 0.2px rgba(255,255,255,0.25), inset 0px 4px 52.6px rgba(255,255,255,0.31)",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
