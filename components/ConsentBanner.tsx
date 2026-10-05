"use client";

import { useSyncExternalStore } from "react";
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
      className="fixed bottom-3 left-3 z-50 w-[calc(100%-1.5rem)] max-w-sm border border-border bg-background p-5 shadow-xl sm:bottom-5 sm:left-5"
    >
      <div className="min-w-0 flex-1">
        <h2 id="consent-title" className="text-base font-semibold">Your privacy, your choice</h2>
        <p id="consent-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          With your permission, we use PostHog analytics cookies and local storage
          to understand how you use Hangry UI and improve it. You can decline
          analytics and still use every component.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => choose("rejected")}>Reject analytics</Button>
        <Button variant="primary" onClick={() => choose("accepted")}>Accept analytics</Button>
      </div>
    </section>
  );
}
