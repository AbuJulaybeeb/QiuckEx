"use client";

import { useState } from "react";
import { Copy, Check, Info, Wallet } from "lucide-react";

interface PaymentLinkStatus {
  username: string;
  amount: string;
  asset: string;
  memo: string | null;
  destinationPublicKey: string;
  expiresAt: string | null;
  swapOptions?: Array<{
    sourceAmount: string;
    sourceAsset: string;
    destinationAmount: string;
    destinationAsset: string;
    hopCount: number;
    pathHops: string[];
    rateDescription: string;
  }> | null;
  acceptsMultipleAssets: boolean;
  acceptedAssets: string[] | null;
  userMessage: string;
  availableActions: string[];
}

interface ActivePaymentStateProps {
  status: PaymentLinkStatus;
  onPaymentInitiated: () => void;
  onPaymentCompleted: (txHash: string) => void;
}

export function ActivePaymentState({
  status,
  onPaymentInitiated,
  onPaymentCompleted,
}: ActivePaymentStateProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSourceAsset, setSelectedSourceAsset] = useState<string | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handlePay = async () => {
    setIsProcessing(true);
    onPaymentInitiated();

    try {
      // Construct Stellar payment URI
      const uri = constructPaymentURI(status, selectedSourceAsset);

      // Try to open Stellar wallet
      window.location.href = uri;

      // For demo purposes, simulate completion
      // In production, you'd poll for payment confirmation
      setTimeout(() => {
        onPaymentCompleted("pending_confirmation");
      }, 2000);
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Failed to copy");
    }
    window.setTimeout(() => setCopyStatus(null), 2500);
  };

  const hasSwapOptions = status.swapOptions && status.swapOptions.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          aria-hidden="true"
          className="w-20 h-20 bg-indigo-500/10 dark:bg-indigo-500/20 ring-1 ring-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Wallet className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black mb-2 text-neutral-900 dark:text-white">
          Payment Request
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md mx-auto">
          {status.userMessage}
        </p>
      </div>

      {/* Payment Details Card */}
      <section aria-labelledby="details-heading">
        <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2
            id="details-heading"
            className="text-lg font-bold mb-6 text-neutral-900 dark:text-white"
          >
            Payment Details
          </h2>

          <dl className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
              <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Recipient</dt>
              <dd className="font-semibold text-neutral-900 dark:text-white">
                @{status.username}
              </dd>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
              <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Amount</dt>
              <dd className="text-2xl font-black text-indigo-600 dark:text-indigo-300">
                {status.amount} {status.asset}
              </dd>
            </div>

           {status.memo && (
             <div className="flex justify-between items-center py-3 border-b border-border">
               <dt className="text-muted">Memo</dt>
               <dd className="font-mono text-sm">{status.memo}</dd>
             </div>
           )}

           {status.expiresAt && (
             <div className="flex justify-between items-center py-3 border-b border-border">
               <dt className="text-muted">Expires</dt>
               <dd className="text-sm">
                 {new Date(status.expiresAt).toLocaleDateString()}
               </dd>
             </div>
           )}
         </dl>
       </div>
      </section>

      {/* Swap Options (if available) */}
      {hasSwapOptions && status.acceptsMultipleAssets && (
        <section aria-labelledby="payment-options-heading">
          <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2
              id="payment-options-heading"
              className="text-lg font-bold mb-2 text-neutral-900 dark:text-white"
            >
              Select Payment Currency
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              You can pay using any of the supported assets below:
            </p>

            <div
              role="radiogroup"
              aria-labelledby="payment-options-heading"
              className="space-y-3"
            >
              {/* Direct payment option */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedSourceAsset === null}
                onClick={() => setSelectedSourceAsset(null)}
                className={`w-full p-4 rounded-xl border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  selectedSourceAsset === null
                    ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/20"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20 bg-transparent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Pay with {status.asset}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Direct payment
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {status.amount} {status.asset}
                  </p>
                </div>
              </button>

              {/* Swap options */}
              {status.swapOptions?.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  role="radio"
                  aria-checked={selectedSourceAsset === option.sourceAsset}
                  aria-label={`Pay with ${option.sourceAmount} ${option.sourceAsset}, rate: ${option.rateDescription}`}
                  onClick={() => setSelectedSourceAsset(option.sourceAsset)}
                  className={`w-full p-4 rounded-xl border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    selectedSourceAsset === option.sourceAsset
                      ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 ring-1 ring-indigo-500/20"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        Pay with {option.sourceAsset}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {option.rateDescription}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {option.sourceAmount}
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider">
                        {option.hopCount} hop(s)
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          aria-label={
            isProcessing
              ? "Opening wallet"
              : `Pay ${status.amount} ${status.asset} to ${status.username}`
          }
          aria-busy={isProcessing}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 disabled:cursor-not-allowed rounded-xl font-bold text-lg text-white transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isProcessing ? "Opening Wallet..." : "Pay Now"}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy payment link to clipboard"
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
              <span>Copy Payment Link</span>
            </>
          )}
        </button>

        <p role="status" aria-live="polite" className="sr-only">
          {copyStatus ?? ""}
        </p>
      </div>

      {/* Info footer */}
      <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-600 dark:text-indigo-200/90 leading-relaxed">
          <strong>How it works:</strong> Clicking &quot;Pay Now&quot; will request transaction signing using your connected Stellar wallet.
        </p>
      </div>
    </div>
  );
}

function constructPaymentURI(
  status: PaymentLinkStatus,
  sourceAsset: string | null,
): string {
  const params = new URLSearchParams({
    destination: status.destinationPublicKey,
    amount: status.amount,
  });

  if (status.asset !== "XLM") {
    params.set("asset_code", status.asset);
  }

  if (status.memo) {
    params.set("memo", status.memo);
    params.set("memo_type", "text");
  }

  if (sourceAsset && sourceAsset !== status.asset) {
    // Path payment
    params.set("send_asset", sourceAsset);
  }

  return `web+stellar:pay?${params.toString()}`;
}
