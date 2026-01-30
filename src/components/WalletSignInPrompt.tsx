"use client";

import { useEffect, useState } from "react";
import { useWalletAuth } from "@/hooks/useWalletAuth";

/**
 * Global prompt shown right after connect, asking the user to sign a message.
 * This mirrors privacy-frontend style: message JSON with sender + timestamp (+ referrer).
 */
export function WalletSignInPrompt() {
  const { connected, needsSignIn, signIn } = useWalletAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Open prompt right after connect if we don't have an auth payload yet.
  useEffect(() => {
    if (connected && needsSignIn) setOpen(true);
    if (!connected) setOpen(false);
  }, [connected, needsSignIn]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] mx-auto w-full max-w-[402px]">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close"
        onClick={() => setOpen(false)}
      />

      <div className="absolute left-1/2 top-[170px] w-[360px] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[#141414] p-5 shadow-[0px_14px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between">
          <div className="font-ibm text-[20px] font-semibold">Sign in</div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/70"
          >
            <span className="text-[18px] leading-none">×</span>
          </button>
        </div>

        <div className="mt-2 font-ibm text-[13px] leading-[18px] text-white/60">
          Please sign a message in Phantom to verify ownership of your wallet.
          <br />
          (We will later send <span className="text-white/80">address + timestamp + signedMessage</span> to the backend.)
        </div>

        {error ? (
          <div className="mt-3 rounded-[12px] bg-[#E83D36]/10 px-3 py-2 font-ibm text-[12px] text-[#E83D36]">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await signIn();
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Sign-in failed");
            } finally {
              setBusy(false);
            }
          }}
          className={
            busy
              ? "mt-5 h-[52px] w-full rounded-[16px] bg-[#FF7A2A]/60 font-ibm text-[16px] font-semibold text-black/70"
              : "mt-5 h-[52px] w-full rounded-[16px] bg-[#FF7A2A] font-ibm text-[16px] font-semibold text-black"
          }
          disabled={busy}
        >
          {busy ? "Waiting for signature…" : "Sign message"}
        </button>
      </div>
    </div>
  );
}
