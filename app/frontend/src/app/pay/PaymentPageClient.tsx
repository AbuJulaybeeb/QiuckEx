"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NetworkBadge } from "@/components/NetworkBadge";
import { ActivePaymentState } from "@/components/payment-states/ActivePaymentState";
import { ExpiredPaymentState } from "@/components/payment-states/ExpiredPaymentState";
import { PaidPaymentState } from "@/components/payment-states/PaidPaymentState";
import { RefundedPaymentState } from "@/components/payment-states/RefundedPaymentState";
import { LoadingState } from "@/components/payment-states/LoadingState";
import { ErrorState } from "@/components/payment-states/ErrorState";
import { getQuickexApiBase } from "@/lib/api";

type LinkState = "ACTIVE" | "EXPIRED" | "PAID" | "REFUNDED" | "DRAFT";

type PaymentLinkStatus = {
  state: LinkState;
  username: string;
  amount: string;
  asset: string;
  memo: string | null;
  destinationPublicKey: string;
  expiresAt: string | null;
  transactionHash: string | null;
  paidAt: string | null;
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
};

type FetchState = "loading" | "success" | "error";

/** Shared full-screen wrapper so every state has a consistent page shell */
function PayPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Skip-to-content for keyboard / screen-reader users */}
      <a
        href="#pay-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <NetworkBadge />
      <main
        id="pay-main"
        aria-label="Payment page"
        className="container mx-auto px-4 py-12 max-w-2xl"
      >
        {children}
      </main>
    </div>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [status, setStatus] = useState<PaymentLinkStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const username = searchParams.get("username") || "";
  const amount = searchParams.get("amount") || "";
  const asset = searchParams.get("asset") || "XLM";
  const memo = searchParams.get("memo") || undefined;
  const acceptedAssets = searchParams.get("acceptedAssets") || undefined;
  const mockState = searchParams.get("mockState");

  const fetchStatus = useCallback(async () => {
    if (!username || !amount) {
      setFetchState("error");
      setError("Missing required parameters: username and amount");
      return;
    }

    setFetchState("loading");
    setError(null);

    // Testing / demo mock state handler
    if (mockState) {
      // Simulate loading briefly
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (mockState === "ERROR") {
        setFetchState("error");
        setError("Failed to fetch payment link status. Please try again.");
        return;
      }
      setStatus({
        state: mockState as LinkState,
        username,
        amount,
        asset,
        memo: memo || "Invoice #98217",
        destinationPublicKey: "GDEMOPUBLICKEY1234567890",
        expiresAt: new Date(Date.now() + 3600 * 1000 * 2).toISOString(), // 2 hours
        transactionHash: mockState === "PAID" ? "GDEMOTXHASH1234567890ABCDEF1234567890ABCDEF" : null,
        paidAt: mockState === "PAID" ? new Date().toISOString() : null,
        acceptsMultipleAssets: true,
        acceptedAssets: ["XLM", "USDC"],
        swapOptions: [
          {
            sourceAmount: (parseFloat(amount) * 1.01).toFixed(2),
            sourceAsset: "USDC",
            destinationAmount: amount,
            destinationAsset: asset,
            hopCount: 1,
            pathHops: ["USDC", asset],
            rateDescription: `1 USDC ≈ ${(1 / 1.01).toFixed(4)} ${asset}`,
          },
        ],
        userMessage:
          mockState === "ACTIVE"
            ? `Send payment to @${username} on Stellar`
            : mockState === "EXPIRED"
            ? "This payment link has expired and is no longer accepting transactions."
            : mockState === "REFUNDED"
            ? "This transaction has been refunded back to the sender."
            : "Payment complete! Funds have been received.",
        availableActions: [],
      });
      setFetchState("success");
      return;
    }

    try {
      const apiBase = getQuickexApiBase();
      const params = new URLSearchParams({
        username,
        amount,
        asset,
      });

      if (memo) params.set("memo", memo);
      if (acceptedAssets) params.set("acceptedAssets", acceptedAssets);

      const response = await fetch(
        `${apiBase}/payment-links/status?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch payment status (${response.status})`,
        );
      }

      const data: PaymentLinkStatus = await response.json();
      setStatus(data);
      setFetchState("success");

      // Track analytics event
      trackAnalyticsEvent("payment_link_viewed", {
        username,
        amount,
        asset,
        state: data.state,
      });
    } catch (err) {
      setFetchState("error");
      setError(err instanceof Error ? err.message : "Unknown error occurred");

      // Track error analytics
      trackAnalyticsEvent("payment_link_error", {
        username,
        amount,
        asset,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [username, amount, asset, memo, acceptedAssets, mockState]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchStatus();

    trackAnalyticsEvent("payment_link_retry", {
      retryCount,
      username,
      amount,
    });
  };

  const handlePaymentInitiated = () => {
    trackAnalyticsEvent("payment_initiated", {
      username,
      amount,
      asset,
      state: status?.state,
    });
  };

  const handlePaymentCompleted = (txHash: string) => {
    trackAnalyticsEvent("payment_completed", {
      username,
      amount,
      asset,
      transactionHash: txHash,
    });

    // Update status locally to transition to PAID state
    setStatus((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        state: "PAID",
        transactionHash: txHash,
        paidAt: new Date().toISOString(),
        userMessage: "Payment completed successfully!",
      };
    });
  };

  if (fetchState === "loading") {
    return (
      <PayPageShell>
        <LoadingState />
      </PayPageShell>
    );
  }

  if (fetchState === "error") {
    return (
      <PayPageShell>
        <ErrorState
          message={error || "Failed to load payment link"}
          onRetry={handleRetry}
          retryCount={retryCount}
        />
      </PayPageShell>
    );
  }

  if (!status) {
    return (
      <PayPageShell>
        <ErrorState
          message="Payment link data is unavailable"
          onRetry={handleRetry}
          retryCount={retryCount}
        />
      </PayPageShell>
    );
  }

  const renderStateComponent = () => {
    switch (status.state) {
      case "ACTIVE":
        return (
          <ActivePaymentState
            status={status}
            onPaymentInitiated={handlePaymentInitiated}
            onPaymentCompleted={handlePaymentCompleted}
          />
        );
      case "EXPIRED":
        return <ExpiredPaymentState status={status} />;
      case "PAID":
        return <PaidPaymentState status={status} />;
      case "REFUNDED":
        return <RefundedPaymentState status={status} />;
      default:
        return (
          <ErrorState
            message={`Unknown payment state: ${status.state}`}
            onRetry={handleRetry}
            retryCount={retryCount}
          />
        );
    }
  };

  return <PayPageShell>{renderStateComponent()}</PayPageShell>;
}

export default function PaymentPageClient() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentPageContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <PayPageShell>
      <LoadingState />
    </PayPageShell>
  );
}

// Simple analytics tracking (replace with your analytics provider)
function trackAnalyticsEvent(event: string, data: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.log(`[Analytics] ${event}`, data);
  }
}
