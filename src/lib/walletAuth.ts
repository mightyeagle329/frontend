import bs58 from "bs58";

export type SolanaAuthMessage = {
  sender: string;
  timestamp: number;
  referrer?: string;
};

export type SolanaAuthPayload = {
  message: string;
  signedMessage: string;
};

export function buildSolanaAuthMessage({
  sender,
  referrer = "abcde",
}: {
  sender: string;
  referrer?: string;
}): SolanaAuthMessage {
  return {
    sender,
    timestamp: Date.now(),
    referrer,
  };
}

export function encodeSignedMessage(signatureBytes: Uint8Array) {
  return bs58.encode(signatureBytes);
}
