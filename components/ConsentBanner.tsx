"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { Button } from "@/registry/components/button";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";

// Hide the banner during SSR and hydration until local storage is checked.
const serverConsent = () => undefined;

export default function ConsentBanner() {
  const consent = useSyncExternalStore<AnalyticsConsent | null | undefined>(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    serverConsent,
  );

  function choose(value: AnalyticsConsent) {
    setAnalyticsConsent(value);
  }

  if (consent !== null) return null;

  return (
    <section
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
      className="fixed bottom-3 left-3 z-50 w-[calc(100%-1.5rem)] max-w-sm border border-border bg-background p-4 shadow-xl sm:bottom-5 sm:left-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h2 id="consent-title" className="text-sm font-semibold">Analytics</h2>
          <button
            type="button"
            aria-label="Dismiss analytics notice"
            onClick={() => choose("accepted")}
            className="inline-flex size-8 shrink-0 items-center justify-center border border-border text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X size={20} strokeWidth={2} className="shrink-0" aria-hidden="true" />
          </button>
        </div>
        <p id="consent-description" className="mt-1 text-sm text-muted-foreground">
          Analytics and masked session replay help us improve Hangry UI.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => choose("rejected")}>Reject analytics</Button>
        <Button variant="primary" onClick={() => choose("accepted")}>Accept analytics</Button>
      </div>
    </section>
  );
}
