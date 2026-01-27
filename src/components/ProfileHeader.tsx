import { IconEdit, IconLightning } from "./icons";

export function ProfileHeader() {
  return (
    <header className="relative h-[80px] w-full">
      {/* Left group: same as HomeHeader */}
      <div className="absolute left-[27px] top-[12px] h-[44px] w-[131px]">
        <div className="absolute left-0 top-0 h-[39px] w-[39px] overflow-hidden rounded-[40px] border border-[#80D1FF] shadow-[0px_4px_24.1px_0px_#3E8BBB]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(62,184,255,0.5),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(217,70,239,0.4),transparent_55%)]" />
        </div>

        <div className="absolute left-[5px] top-[31px] h-[13px] w-[30px] rounded-[30px] bg-[#3EB8FF] shadow-[0px_1px_13.6px_0px_#3EB8FF]">
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-ibm text-[9px] font-semibold leading-[9px] text-black">
              LVL 5
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="absolute left-[48px] top-[5px] whitespace-nowrap font-ibm text-[15px] font-semibold leading-[15px] text-white">
          DEGEN KING
        </div>

        {/* Streak (keep on one line) */}
        <div className="absolute left-[48px] top-[25px] flex items-center gap-[4px] whitespace-nowrap text-[#3EB8FF]">
          <IconLightning className="h-[13px] w-[7px]" />
          <span className="font-ibm text-[10px] font-semibold leading-[10px]">
            12 STREAK
          </span>
        </div>
      </div>

      {/* Edit button aligned with top row like HomeHeader */}
      <button
        type="button"
        aria-label="Edit profile"
        className="absolute left-[346px] top-[19px] grid h-[40px] w-[40px] place-items-center rounded-full bg-white/10"
      >
        <IconEdit className="h-[18px] w-[18px] text-white/85" />
      </button>
    </header>
  );
}
