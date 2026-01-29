import { PublicKey } from "@solana/web3.js";

/**
 * Minimal token list for the UI.
 * We only need USDT for the Deposit mock right now.
 *
 * NOTE: Solana USDT mint (mainnet): Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
 */
export const SOLANA_USDT_MINT = new PublicKey(
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
);

export type SolanaToken = {
  symbol: "USDT";
  mint: PublicKey;
  decimals: number;
  iconSrc: string;
};

export const SOLANA_TOKENS: SolanaToken[] = [
  {
    symbol: "USDT",
    mint: SOLANA_USDT_MINT,
    decimals: 6,
    iconSrc: "/icons/usdt.png",
  },
];
