import { IconLightning } from "./icons";
import { SolanaBalancePill } from "./SolanaBalancePill";

export function HomeHeader() {
  return (
    <header className="relative h-[72px] w-full">
      {/* Left group: 131x44 @ (27,12) */}
      <div className="absolute left-[27px] top-[12px] h-[44px] w-[131px]">
        {/* Avatar: 39x39 @ (27,12) */}
        <div className="absolute left-0 top-0 h-[39px] w-[39px] overflow-hidden rounded-[40px] border border-[#80D1FF] shadow-[0px_4px_24.1px_0px_#3E8BBB]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(62,184,255,0.5),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(217,70,239,0.4),transparent_55%)]" />
        </div>

        {/* LVL group: 30x13 @ (32,43) (relative inside header) */}
        <div className="absolute left-[5px] top-[31px] h-[13px] w-[30px] rounded-[30px] bg-[#3EB8FF] shadow-[0px_1px_13.6px_0px_#3EB8FF]">
          {/* LVL text box: 21x12 @ (37,94). Convert to inside-group: left 37-32=5, top 94-43=51; but we only need centering within the 30x13 pill */}
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-ibm text-[9px] font-semibold leading-[9px] text-black">
              LVL 5
            </span>
          </div>
        </div>

        {/* DEGEN KING: (75,17) */}
        <div className="absolute left-[48px] top-[5px] font-ibm text-[15px] font-semibold leading-[15px] text-white">
          DEGEN KING
        </div>

        {/* Lightning: width 7, height 13 @ (77,37) */}
        <div className="absolute left-[50px] top-[25px] h-[13px] w-[7px] text-[#3EB8FF]">
          <IconLightning className="h-[13px] w-[7px]" />
        </div>

        {/* 12 STREAK: width 48, height 13 @ (86,37) */}
        <div className="absolute left-[59px] top-[25px] h-[13px] w-[48px] font-ibm text-[10px] font-semibold leading-[10px] text-[#3EB8FF]">
          <div className="flex h-full items-center">12 STREAK</div>
        </div>
      </div>

      {/* Right wallet pill: 116x31 @ (259,19) */}
      <div className="absolute left-[259px] top-[19px]">
        <SolanaBalancePill />
      </div>
    </header>
  );
}
