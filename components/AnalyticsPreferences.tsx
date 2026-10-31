"use client";

import { memo, useSyncExternalStore } from "react";
import { Button } from "@/hangry/components/button";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";

const serverConsent = () => undefined;

export const AnalyticsPreferences = memo(function AnalyticsPreferences() {
  const consent = useSyncExternalStore<AnalyticsConsent | null | undefined>(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    serverConsent,
  );

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        Analytics:{" "}
        {consent === "rejected"
          ? "Rejected"
          : consent === "accepted"
            ? "Accepted"
            : "Enabled by default"}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Analytics preference">
        <Button
          variant="secondary"
          aria-pressed={consent === "rejected"}
          onClick={() => setAnalyticsConsent("rejected")}
        >
          Reject analytics
        </Button>
        <Button
          variant="primary"
          aria-pressed={consent === "accepted"}
          onClick={() => setAnalyticsConsent("accepted")}
        >
          Accept analytics
        </Button>
      </div>
    </div>
  );
});
