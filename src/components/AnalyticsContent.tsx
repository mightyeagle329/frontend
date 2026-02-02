import { IconRefresh } from "./icons";

export type AnalyticsCardData = {
  pairLabel: string;
  title: string;
  price: string;
  noPct: number;
  yesPct: number;
};

export function AnalyticsContent({
  onToggle,
  data,
}: {
  onToggle?: () => void;
  data?: AnalyticsCardData;
}) {
  const d: AnalyticsCardData =
    data ??
    ({
      pairLabel: "PEPE/USDT BINARY",
      title: "Pro Market Analytics",
      price: "$450.12",
      noPct: 47,
      yesPct: 53,
    } satisfies AnalyticsCardData);

  return (
    <div className="relative h-full w-full text-white">
      {/* Title block */}
      <div
        className="absolute left-[27px] top-[23px] font-ibm text-[16px] font-normal leading-[20.16px] tracking-[0.11em] text-white/60"
      >
        {d.pairLabel}
      </div>

      <div className="absolute left-[27px] top-[46px] font-ibm text-[25px] font-semibold leading-[26px]">
        {d.title}
      </div>

      {/* Reverse button: 33x24 @ (288,23) */}
      <button
        type="button"
        aria-label="Refresh"
        onClick={(e) => {
          // Prevent the card tap handler from opening the YES/NO overlay.
          e.stopPropagation();
          onToggle?.();
        }}
        data-noswipe
        className="absolute left-[288px] top-[27px] grid h-[24px] w-[33px] place-items-center rounded-[50px]"
      >
        <div
          className="grid h-full w-full place-items-center rounded-[50px]"
          style={{
            // 1px border with gradient (design update)
            background:
              "linear-gradient(#E96023, #E96023) padding-box, linear-gradient(133.81deg, #FFFFFF -4.79%, #E96023 94.8%) border-box",
            border: "1px solid transparent",
          }}
        >
          <IconRefresh className="h-[14px] w-[14px] text-white" />
        </div>
      </button>

      {/* Price trend panel: 304x205 @ (20,92) */}
      <div className="absolute left-[20px] top-[92px] h-[205px] w-[304px] rounded-[26px] bg-white/5" />

      <div className="absolute left-[112px] top-[103px] w-[119px] whitespace-nowrap text-center font-ibm text-[13px] font-normal leading-[16.38px] tracking-[0.11em] text-white/60">
        24H PRICE TREND
      </div>

      <div className="absolute left-[118px] top-[127px] w-[111px] text-center font-ibm text-[30px] font-semibold leading-[31px]">
        {d.price}
      </div>

      {/* Chart area bg gradient (design update) */}
      <div
        className="absolute left-[37px] top-[165px] h-[111.717px] w-[274px] rounded-[18px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(233, 96, 35, 0.51) 0%, #1C1C1C 82.21%)",
          filter: "blur(0px)",
          opacity: 0.9,
        }}
      />

      {/* Chart line (approx) */}
      <svg
        className="absolute left-[37px] top-[165px]"
        width="274"
        height="112"
        viewBox="0 0 274 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 70 C 30 28, 48 88, 70 58 C 86 36, 102 72, 118 52 C 136 30, 150 88, 168 54 C 186 22, 202 92, 218 56 C 234 18, 250 68, 266 40"
          stroke="#E96023"
          strokeWidth="2"
        />
      </svg>

      {/* Axis labels */}
      <div className="absolute left-[37px] top-[270px] w-[45px] text-center font-ibm text-[10px] font-normal leading-[12.6px] tracking-[0.11em] text-white/60">
        24H AGO
      </div>
      <div className="absolute left-[163px] top-[270px] w-[20px] text-center font-ibm text-[10px] font-normal leading-[12.6px] tracking-[0.11em] text-white/60">
        12H
      </div>
      <div className="absolute left-[288px] top-[270px] w-[23px] text-center font-ibm text-[10px] font-normal leading-[12.6px] tracking-[0.11em] text-white/60">
        NOW
      </div>

      {/* Liquidity header row */}
      <div className="absolute left-[27px] top-[311px] w-[109px] whitespace-nowrap font-ibm text-[12px] font-normal leading-[15.12px] tracking-[0.11em] text-white">
        LIQUIDITY DEPTH
      </div>

      <div className="absolute left-[235px] top-[316px] h-[5px] w-[5px] rounded-full bg-[#68AAE4] shadow-[0px_1px_5.9px_0px_#68AAE4]" />
      <div className="absolute left-[243px] top-[311px] w-[81px] whitespace-nowrap font-ibm text-[12px] font-normal leading-[15.12px] tracking-[0.11em] text-[#62ADE9]">
        LIVE MARKET
      </div>

      {/* 47/53 pills */}
      <div className="absolute left-[20px] top-[340px] flex h-[47px] w-[154px] items-center justify-center rounded-[26px] bg-white/10">
        <span className="font-ibm text-[17px] font-semibold leading-[18px]">
          {d.noPct}% (No)
        </span>
      </div>

      <div className="absolute left-[179px] top-[340px] flex h-[47px] w-[145px] items-center justify-center rounded-[26px] bg-white/10">
        <span className="font-ibm text-[17px] font-semibold leading-[18px]">
          {d.yesPct}% (Yes)
        </span>
      </div>

      {/* Depth bars (8) */}
      <div className="absolute left-[35px] top-[403px] w-[139px] space-y-[10px]">
        <div className="ml-auto h-[13px] w-[139px] rounded-[8px] bg-[#FF5E004F]" />
        <div className="ml-auto h-[13px] w-[118px] rounded-[8px] bg-[#FF5E004F]" />
        <div className="ml-auto h-[13px] w-[92px] rounded-[8px] bg-[#FF5E004F]" />
        <div className="ml-auto h-[13px] w-[78px] rounded-[8px] bg-[#FF5E004F]" />
      </div>

      <div className="absolute left-[183px] top-[403px] space-y-[10px]">
        <div className="h-[13px] w-[102px] rounded-[8px] bg-[#4AF3474F]" />
        <div className="h-[13px] w-[86px] rounded-[8px] bg-[#4AF3474F]" />
        <div className="h-[13px] w-[70px] rounded-[8px] bg-[#4AF3474F]" />
        <div className="h-[13px] w-[54px] rounded-[8px] bg-[#4AF3474F]" />
      </div>
    </div>
  );
}
