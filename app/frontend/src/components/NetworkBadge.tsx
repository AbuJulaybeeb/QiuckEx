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
    testnet: "bg-warning-soft text-warning border border-warning-soft",
    futurenet: "bg-brand-soft text-brand border border-brand-soft",
    mainnet: "bg-success-soft text-success border border-success-soft",
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