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

      {/* Heading + message */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
          Unable to Load Payment
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-md leading-relaxed mx-auto">
          {message}
        </p>
      </div>

      {/* Multiple-failure hint */}
      {isMultipleFailures && (
        <div
          role="note"
          className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 max-w-md w-full"
        >
          <h2 className="text-amber-800 dark:text-amber-300 text-sm font-bold mb-2">
            Multiple failures detected.
          </h2>
          <p className="text-neutral-600 dark:text-amber-200/90 text-sm mb-2">
            This could be due to:
          </p>
          <ul className="text-neutral-600 dark:text-amber-200/90 text-sm space-y-1 list-disc list-inside">
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
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>
            {retryCount === 0 ? "Try Again" : `Retry (${retryCount + 1})`}
          </span>
        </button>

        <Link
          href="/"
          className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/5 rounded-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>

      {retryCount > 0 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          Still having issues? Contact support with the error message above.
        </p>
      )}
    </div>
  );
}
