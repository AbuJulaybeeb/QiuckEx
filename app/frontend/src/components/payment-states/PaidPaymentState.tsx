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
        <h1 className="text-4xl font-black mb-3 text-emerald-600 dark:text-emerald-400">
          Payment Complete!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-md mx-auto">
          {status.userMessage}
        </p>
      </div>

      {/* Payment Success Card */}
      <section aria-labelledby="paid-summary-heading">
        <div className="bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 dark:from-emerald-500/10 dark:to-indigo-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2
            id="paid-summary-heading"
            className="text-xl font-bold mb-6 text-neutral-900 dark:text-white"
          >
            Payment Summary
          </h2>

          <dl className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
              <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Paid To</dt>
              <dd className="font-semibold text-neutral-900 dark:text-white">
                @{status.username}
              </dd>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
              <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Amount Paid</dt>
              <dd className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {status.amount} {status.asset}
              </dd>
            </div>

            {status.memo && (
              <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
                <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Memo</dt>
                <dd className="font-mono text-sm text-neutral-900 dark:text-neutral-200">
                  {status.memo}
                </dd>
              </div>
            )}

            {status.paidAt && (
              <div className="flex justify-between items-center py-3">
                <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Completed At</dt>
                <dd className="text-sm text-neutral-900 dark:text-neutral-200 font-medium">
                  <time dateTime={status.paidAt}>
                    {new Date(status.paidAt).toLocaleString()}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Transaction Hash */}
      {status.transactionHash && (
        <section aria-labelledby="tx-hash-heading">
          <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3
              id="tx-hash-heading"
              className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-3"
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

      {/* Success callout */}
      <div
        role="note"
        className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 flex gap-4"
      >
        <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
            What&apos;s next?
          </h3>
          <p className="text-sm text-neutral-600 dark:text-emerald-200/90 leading-relaxed">
            Your payment has been confirmed on the Stellar network. The
            recipient has been notified and the funds are now available in
            their account.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg text-white text-center transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Homepage</span>
        </Link>

        {status.transactionHash && (
          <button
            type="button"
            aria-label="Copy transaction hash to clipboard"
            onClick={handleCopyHash}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/5"
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
