"use client";

import { useEffect, useState } from "react";

export function NetworkBadge() {
  const [network, setNetwork] = useState<string | undefined>(undefined);

  useEffect(() => {
    setNetwork(process.env.NEXT_PUBLIC_STELLAR_NETWORK);
  }, []);

  if (!network) return null;

  const normalized = network.toLowerCase();

  const badgeStyles: Record<string, string> = {
    testnet:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30",
    futurenet:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30",
    mainnet:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30",
  };

  const label = {
    testnet: "TESTNET",
    futurenet: "FUTURENET",
    mainnet: "MAINNET",
  }[normalized] ?? network.toUpperCase();

  return (
    <div
      role="status"
      aria-label={`Stellar network: ${label}`}
      className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-black tracking-wider transition-all z-40 shadow-sm backdrop-blur-md ${
        badgeStyles[normalized] || "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
      }`}
    >
      {label}
      {!process.env.NEXT_PUBLIC_STELLAR_NETWORK && (
        <span className="ml-1 opacity-60 font-medium italic">(default)</span>
      )}
    </div>
  );
}