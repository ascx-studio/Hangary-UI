import posthog from "posthog-js/full/no-external";

export type AnalyticsConsent = "accepted" | "rejected";
const storageKey = "hangry-ui-analytics-consent";
const changeEvent = "analytics-consent-change";
let sessionConsent: AnalyticsConsent | undefined;
let initialized = false;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (sessionConsent) return sessionConsent;
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function syncAnalyticsConsent() {
  if (getAnalyticsConsent() !== "accepted") {
    if (initialized) posthog.opt_out_capturing();
    return;
  }

  if (initialized) {
    posthog.opt_in_capturing({ captureEventName: false });
    return;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || !process.env.NEXT_PUBLIC_POSTHOG_HOST) return;

  posthog.init(key, {
    api_host: "/ingest",
    defaults: "2026-01-30",
    capture_exceptions: true,
    capture_dead_clicks: false,
    disable_external_dependency_loading: true,
    disable_session_recording: true,
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    loaded: (client) => client.opt_in_capturing(),
    debug: process.env.NODE_ENV === "development",
  });
  initialized = true;
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  sessionConsent = consent;
  try {
    window.localStorage.setItem(storageKey, consent);
  } catch {
    // Keep the choice for this page when browser storage is unavailable.
  }
  syncAnalyticsConsent();
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeAnalyticsConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    sessionConsent = undefined;
    syncAnalyticsConsent();
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
}
