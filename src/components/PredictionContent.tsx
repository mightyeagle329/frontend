import Image from "next/image";
import { IconBars, IconClock, IconRefresh } from "./icons";

export function PredictionContent({ onToggle }: { onToggle?: () => void }) {
  return (
    <div className="relative h-full w-full text-white">
      {/* Background illustration */}
      <div className="absolute left-[-35px] top-[-3px] h-[290px] w-[413px]">
        <Image
          src="/icons/bg_prediction.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,1,28,0)_0%,#05011C_100%)]" />
      </div>

      {/* Time left pill: 91x24 @ (17.99,19.86) */}
      <div className="absolute left-[18px] top-[20px] flex h-[24px] w-[91px] items-center gap-[4px] rounded-[50px] bg-[#E83D36] px-[7px]">
        <IconClock className="h-[16px] w-[16px] text-white" />
        <span className="font-ibm text-[12px] font-normal leading-[13.44px]">
          2h 43m left
        </span>
      </div>

      {/* Live prediction pill: 117x24 @ (114,19.86) */}
      <div className="absolute left-[114px] top-[20px] flex h-[24px] w-[117px] items-center gap-[4px] rounded-[50px] border border-white/90 bg-black/0 px-[8px]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#67FB37]" />
        <span className="whitespace-nowrap font-ibm text-[12px] font-normal leading-[13.44px]">
          LIVE PREDICTION
        </span>
      </div>

      {/* Refresh button same as analytics (33x24 @ 288,23) */}
      <button
        type="button"
        aria-label="Toggle"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
        className="absolute left-[288px] top-[23px] grid h-[24px] w-[33px] place-items-center rounded-[50px] bg-[#A10FCA] shadow-[0px_4px_18.1px_0px_#A121C5]"
      >
        <IconRefresh className="h-[14px] w-[14px] text-white" />
      </button>

      {/* PREDICT & EARN */}
      <div className="absolute left-[103px] top-[292px] w-[136px] whitespace-nowrap text-center font-ibm text-[16px] font-normal leading-[20.16px] tracking-[0.11em] text-white/60">
        PREDICT & EARN
      </div>

      {/* Question */}
      <div className="absolute left-[32px] top-[316px] w-[283px] text-center font-ibm text-[30px] font-semibold leading-[31px]">
        Will <span className="text-[#C531EE]">$PEPE</span> break the ATH before
        midnight?
      </div>

      {/* Progress bar */}
      <div className="absolute left-[27px] top-[401px] h-[8px] w-[292px] rounded-[30px] bg-[#A10FCA30]" />
      <div className="absolute left-[27px] top-[401px] h-[8px] w-[231.415px] rounded-[30px] bg-[#A10FCA] shadow-[0px_0px_10.1px_0px_#A10FCA]" />

      {/* Pool row */}
      <div className="absolute left-[25px] top-[444px] flex items-center gap-[6px]">
        <IconBars className="h-[17px] w-[17px] text-white/80" />
        <span className="font-ibm text-[12px] font-normal leading-[13.44px]">
          POOL: $745,290
        </span>
      </div>

      {/* Yes vibes pill */}
      <div className="absolute left-[218px] top-[442px] flex h-[24px] w-[101px] items-center justify-center rounded-[30px] bg-[#916EE94F]">
        <span className="font-ibm text-[12px] font-medium leading-[13.44px]">
          72% YES VIBES
        </span>
      </div>
    </div>
  );
}
