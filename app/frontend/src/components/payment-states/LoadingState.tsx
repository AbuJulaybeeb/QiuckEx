"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading payment details"
      className="flex flex-col items-center justify-center min-h-[40vh] gap-6"
    >
      {/* Spinner */}
      <div className="relative" aria-hidden="true">
        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-neutral-900 dark:text-white">
          Loading payment details&hellip;
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Please wait while we fetch the payment information.
        </p>
      </div>
    </div>
  );
}
