"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryCount: number;
}

export function ErrorState({ message, onRetry, retryCount }: ErrorStateProps) {
  const isMultipleFailures = retryCount >= 2;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center min-h-[40vh] px-4 gap-6"
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        className="w-20 h-20 bg-red-500/10 dark:bg-red-500/20 rounded-full flex items-center justify-center ring-1 ring-red-500/20"
      >
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Unable to Load Payment</h2>
      <p className="text-muted text-center max-w-md mb-8">{message}</p>

      {/* Multiple-failure hint */}
      {isMultipleFailures && (
        <div className="bg-warning-soft border border-amber-500/20 rounded-xl p-4 mb-8 max-w-md">
          <p className="text-warning text-sm">
            <strong>Multiple failures detected.</strong> This could be due to:
          </p>
          <ul className="text-warning/90 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>Network connectivity issues</li>
            <li>Server temporarily unavailable</li>
            <li>Invalid payment link parameters</li>
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center w-full max-w-xs">
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <RefreshCw className="w-4 h-4" />
          <span>
            {retryCount === 0 ? "Try Again" : `Retry (${retryCount + 1})`}
          </span>
        </button>

        <Link
          href="/"
          className="px-6 py-3 bg-surface-strong hover:bg-surface-strong rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>

      {retryCount > 0 && (
        <p className="mt-6 text-xs text-muted">
          Still having issues? Contact support with the error message above.
        </p>
      )}
    </div>
  );
}
