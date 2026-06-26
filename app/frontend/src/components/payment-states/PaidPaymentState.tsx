"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ExternalLink, Copy, Check, Home } from "lucide-react";

interface PaymentLinkStatus {
  username: string;
  amount: string;
  asset: string;
  memo: string | null;
  transactionHash: string | null;
  paidAt: string | null;
  userMessage: string;
}

interface PaidPaymentStateProps {
  status: PaymentLinkStatus;
}

export function PaidPaymentState({ status }: PaidPaymentStateProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const explorerUrl = status.transactionHash
    ? `https://stellarchain.io/tx/${status.transactionHash}`
    : null;

  const handleCopyHash = async () => {
    if (!status.transactionHash) return;
    try {
      await navigator.clipboard.writeText(status.transactionHash);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Failed to copy");
    }
    window.setTimeout(() => setCopyStatus(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          aria-hidden="true"
          className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 ring-1 ring-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse motion-reduce:animate-none"
        >
          <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-success">
          Payment Complete!
        </h1>
        <p className="text-muted text-lg">{status.userMessage}</p>
      </div>

      {/* Payment Success Card */}
      <div className="bg-gradient-to-br from-green-500/10 to-indigo-500/10 border border-green-400/30 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Payment Summary</h2>

        <dl className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <dt className="text-muted">Paid To</dt>
            <dd className="font-semibold">@{status.username}</dd>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <dt className="text-muted">Amount Paid</dt>
            <dd className="text-3xl font-bold text-success">
              {status.amount} {status.asset}
            </dd>
          </div>

          {status.memo && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <dt className="text-muted">Memo</dt>
              <dd className="font-mono text-sm">{status.memo}</dd>
            </div>

          {status.paidAt && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <dt className="text-muted">Completed At</dt>
              <dd className="text-sm">
                {new Date(status.paidAt).toLocaleString()}
              </dd>
            </div>

           {status.memo && (
             <div className="flex justify-between items-center py-3 border-b border-border">
               <dt className="text-muted">Memo</dt>
               <dd className="font-mono text-sm">{status.memo}</dd>
             </div>
           )}

           {status.paidAt && (
             <div className="flex justify-between items-center py-3 border-b border-border">
               <dt className="text-muted">Completed At</dt>
               <dd className="text-sm">
                 {new Date(status.paidAt).toLocaleString()}
               </dd>
             </div>
           )}
         </dl>
       </div>
      </section>

      {/* Transaction Hash */}
      {status.transactionHash && (
        <div className="bg-card/50 border border-border-strong rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted mb-3">
            Transaction Hash
          </h3>
          <div className="bg-background/50 rounded-xl p-4 font-mono text-xs break-all">
            {status.transactionHash}
          </div>

          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View transaction on Stellar explorer (opens in new tab)"
              className="mt-4 inline-flex items-center gap-2 text-brand hover:text-brand underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              Transaction Hash
            </h3>
            <div className="bg-neutral-50 dark:bg-black/50 border border-neutral-100 dark:border-white/5 rounded-xl p-4 font-mono text-xs break-all text-neutral-800 dark:text-neutral-300 select-all">
              {status.transactionHash}
            </div>

            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View transaction on Stellar explorer (opens in new tab)"
                className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-semibold underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Success Message */}
      <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0" aria-hidden="true">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-success mb-2">
              What&apos;s next?
            </h3>
            <p className="text-sm text-success/90">
              Your payment has been confirmed on the Stellar network. The
              recipient has been notified and the funds are now available in
              their account.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/"
          className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Home className="w-5 h-5" />
          <span>Back to Homepage</span>
        </Link>

        {status.transactionHash && (
          <button
            type="button"
            aria-label="Copy transaction hash to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(status.transactionHash!);
            }}
            className="w-full py-3 bg-surface-strong hover:bg-surface-strong rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {copyStatus ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{copyStatus}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Transaction Hash</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
