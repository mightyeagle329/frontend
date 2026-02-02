"use client";

import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useAuthSession } from "@/providers/AuthSessionProvider";
import { useState } from "react";

export function SolanaBalancePill() {
  const { connected, connecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { needsSignIn } = useWalletAuth();
  const { session } = useAuthSession();

  const [connectError, setConnectError] = useState<string | null>(null);

  const phantomInstalled =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.phantom?.solana?.isPhantom;

  const displayValue = connected
    ? session?.address
      ? `${session.address.slice(0, 4)}…${session.address.slice(-4)}`
      : publicKey
        ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
        : "--"
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
          ? needsSignIn
            ? "Sign"
            : displayValue
          : connecting
            ? "…"
            : connectError
              ? "Retry"
              : displayValue}
      </span>
    </button>
  );
}
