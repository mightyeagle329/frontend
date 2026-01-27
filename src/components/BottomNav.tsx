"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onLeaderboard = pathname.startsWith("/leaderboard");
  const onPortfolio = pathname.startsWith("/portfolio");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto h-[94px] w-full max-w-[402px] bg-[#060606] safe-pb">
      {/* Home */}
      <Link
        href="/"
        className="no-tap-highlight absolute left-[48px] top-[19px]"
        aria-label="Home"
      >
        <div className="relative h-[25.893px] w-[24.335px]">
          <Image
            src={onHome ? "/icons/home-color.svg" : "/icons/home.svg"}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div
          className={
            onHome
              ? "mt-[3px] w-[37px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-[#DA55FF]"
              : "mt-[3px] w-[37px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-white/70"
          }
        >
          Home
        </div>
      </Link>

      {/* Leaderboard */}
      <Link
        href="/leaderboard"
        className="no-tap-highlight absolute left-[143px] top-[20px]"
        aria-label="Leaderboard"
      >
        <div className="relative h-[24px] w-[24px]">
          <Image
            src={
              onLeaderboard
                ? "/icons/leaderboard-color.svg"
                : "/icons/leaderboard.svg"
            }
            alt=""
            fill
            className="object-contain opacity-80"
          />
        </div>
        <div
          className={
            onLeaderboard
              ? "mt-[4px] -ml-[27px] w-[78px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-[#DA55FF]"
              : "mt-[4px] -ml-[27px] w-[78px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-white/70"
          }
        >
          Leaderboard
        </div>
      </Link>

      {/* Portfolio */}
      <Link
        href="/portfolio"
        className="no-tap-highlight absolute left-[247px] top-[20px]"
        aria-label="Portfolio"
      >
        <div className="relative h-[24px] w-[24px]">
          <Image
            src={onPortfolio ? "/icons/portfolio-color.svg" : "/icons/portfolio.svg"}
            alt=""
            fill
            className="object-contain opacity-80"
          />
        </div>
        <div
          className={
            onPortfolio
              ? "mt-[4px] -ml-[14px] w-[52px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-[#DA55FF]"
              : "mt-[4px] -ml-[14px] w-[52px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-white/70"
          }
        >
          Portfolio
        </div>
      </Link>

      {/* Profile */}
      <Link
        href="/"
        className="no-tap-highlight absolute left-[334px] top-[20px]"
        aria-label="Profile"
      >
        <div className="relative h-[24px] w-[24px]">
          <Image src="/icons/user.svg" alt="" fill className="object-contain opacity-80" />
        </div>
        <div className="mt-[4px] -ml-[6px] w-[40px] text-center font-ibm text-[15px] font-normal leading-[16.8px] text-white/70">
          Profile
        </div>
      </Link>
    </nav>
  );
}
