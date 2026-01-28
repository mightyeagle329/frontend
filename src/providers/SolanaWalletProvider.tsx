"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles for wallet-adapter modal/buttons (optional, but safe).
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // RPC endpoint (override with NEXT_PUBLIC_SOLANA_RPC_URL if you have a paid/provider URL)
  // NOTE: Some networks block api.mainnet-beta.solana.com (403). Default to a public RPC.
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://solana-rpc.publicnode.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: "confirmed",
      }}
    >
      {/* autoConnect is needed so selecting a wallet in the modal actually connects */}
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
