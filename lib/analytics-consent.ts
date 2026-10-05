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
  if (getAnalyticsConsent() === "rejected") {
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
    autocapture: true,
    capture_pageview: "history_change",
    capture_pageleave: true,
    disable_scroll_properties: false,
    capture_heatmaps: true,
    rageclick: true,
    capture_exceptions: true,
    capture_dead_clicks: true,
    capture_performance: { web_vitals: true, network_timing: true },
    disable_external_dependency_loading: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      blockSelector: 'input[type="hidden"], input[type="file"], [data-private]',
      maskTextSelector: "[data-sensitive]",
      recordHeaders: false,
      recordBody: false,
    },
    enable_recording_console_log: false,
    disable_surveys: false,
    disable_web_experiments: false,
    opt_out_capturing_by_default: false,
    opt_out_persistence_by_default: false,
    before_send: (event) => {
      if (!event) return null;
      // Use the event URL so pageleave keeps the context of the page being left.
      const url = event.properties?.$current_url;
      const pathname = new URL(typeof url === "string" ? url : window.location.href).pathname;
      const [, section, slug] = pathname.split("/");
      event.properties = {
        ...event.properties,
        project_name: "Hangry UI",
        site_section: section || "home",
        catalog_item: ["components", "blocks", "shader"].includes(section) ? slug : undefined,
      };
      return event;
    },
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
