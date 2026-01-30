import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import { WalletSignInPrompt } from "@/components/WalletSignInPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-ibm-plex-sans-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Degen King",
  description: "Mobile UI prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSansCondensed.variable} antialiased min-h-dvh bg-[#05060b] text-white`}
      >
        <SolanaWalletProvider>
          {children}
          <WalletSignInPrompt />
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
