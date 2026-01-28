"use client";

import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useState } from "react";

function formatUsd(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SolanaBalancePill() {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance, loading } = useSolBalance();

  const [connectError, setConnectError] = useState<string | null>(null);

  const phantomInstalled =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.phantom?.solana?.isPhantom;

  // NOTE: Design shows USD. For now we show SOL amount formatted like "$4,206.91".
  // You can later provide SOL->USD price feed and we will convert.
  const displayValue = connected
    ? loading
      ? "…"
      : balance == null
        ? "--"
        : formatUsd(balance)
    : "Connect";

  // NOTE: the balance hook uses publicKey; if connect fails you will stay on "Connect".

  return (
    <button
      type="button"
      onClick={async () => {
        if (connected) return;
        setConnectError(null);

        if (!phantomInstalled) {
          // If Phantom extension isn't present, open Phantom website.
          // (On mobile, user should open this site inside Phantom's in-app browser.)
          window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
          return;
        }

        // Open the standard wallet-adapter modal.
        // With WalletProvider autoConnect enabled, selecting Phantom will connect.
        setVisible(true);
      }}
      className="flex h-[31px] w-[116px] items-center gap-2 rounded-[16px] border border-[#2C2C2C] bg-black/30 px-[10px] backdrop-blur"
      aria-label={connected ? "Wallet balance" : "Connect wallet"}
    >
      <div className="relative h-[18px] w-[21px] overflow-visible">
        <Image
          src="/icons/balance.svg"
          alt="Balance"
          fill
          className="object-contain origin-center scale-[2.5]"
        />
      </div>

      <span className="truncate font-ibm text-[16px] font-medium leading-[16px] text-white">
        {connected
          ? `$${displayValue}`
          : connecting
            ? "…"
            : connectError
              ? "Retry"
              : displayValue}
      </span>
    </button>
  );
}
