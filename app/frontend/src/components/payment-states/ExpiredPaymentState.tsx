"use client";

import Link from "next/link";
import { Clock, AlertTriangle, ArrowLeft, Home } from "lucide-react";

interface PaymentLinkStatus {
  username: string;
  amount: string;
  asset: string;
  memo: string | null;
  expiresAt: string | null;
  userMessage: string;
}

interface ExpiredPaymentStateProps {
  status: PaymentLinkStatus;
}

export function ExpiredPaymentState({ status }: ExpiredPaymentStateProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          aria-hidden="true"
          className="w-20 h-20 bg-orange-500/10 dark:bg-orange-500/20 ring-1 ring-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Clock className="w-10 h-10 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-3xl font-black mb-2 text-neutral-900 dark:text-white">
          Link Expired
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md mx-auto">
          {status.userMessage}
        </p>
      </div>

      {/* Payment Details Card */}
      <section aria-labelledby="expired-details-heading">
        <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2
            id="expired-details-heading"
            className="text-lg font-bold mb-6 text-neutral-900 dark:text-white"
          >
            Original Payment Details
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
              <dd className="text-2xl font-black text-neutral-900 dark:text-white">
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

            {status.expiresAt && (
              <div className="flex justify-between items-center py-3">
                <dt className="text-neutral-500 dark:text-neutral-400 text-sm">Expired On</dt>
                <dd className="text-sm text-neutral-900 dark:text-neutral-200 font-medium">
                  <time dateTime={status.expiresAt}>
                    {new Date(status.expiresAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Warning callout */}
      <div
        role="note"
        className="bg-orange-500/5 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-5 flex gap-4"
      >
        <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
          <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-1">
            Why did this expire?
          </h3>
          <p className="text-sm text-neutral-600 dark:text-orange-200/90 leading-relaxed">
            Payment links have an expiration date for security reasons. This
            link was not used before it expired. Please contact the recipient
            to generate a new payment link.
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
          <span>Go to Homepage</span>
        </Link>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
