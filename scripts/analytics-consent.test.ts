import { mock, test } from "node:test";
import assert from "node:assert/strict";
import posthog from "posthog-js/full/no-external";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ConsentBanner from "../components/ConsentBanner";

const init = mock.method(posthog, "init", () => posthog);
const optIn = mock.method(posthog, "opt_in_capturing", () => {});
const optOut = mock.method(posthog, "opt_out_capturing", () => {});

test("analytics defaults on, remembers choices, and supports withdrawal and blocked storage", async () => {
  const values = new Map<string, string>();
  const browser = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    },
  });
  const previousWindow = globalThis.window;
  const previousKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const previousHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
  process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://example.com";

  try {
    const { getAnalyticsConsent, setAnalyticsConsent, syncAnalyticsConsent, subscribeAnalyticsConsent } = await import("../lib/analytics-consent");
    // Server HTML must not flash the banner before the browser checks storage.
    assert.equal(renderToStaticMarkup(createElement(ConsentBanner)), "");
    for (const choice of ["accepted", "rejected"]) {
      values.set("hangry-ui-analytics-consent", choice);
      assert.equal(getAnalyticsConsent(), choice);
      assert.equal(renderToStaticMarkup(createElement(ConsentBanner)), "");
    }
    values.clear();
    const changed = mock.fn(() => {});
    const unsubscribe = subscribeAnalyticsConsent(changed);

    syncAnalyticsConsent();
    assert.equal(getAnalyticsConsent(), null);
    assert.equal(init.mock.callCount(), 1);
    setAnalyticsConsent("rejected");
    assert.equal(getAnalyticsConsent(), "rejected");
    assert.equal(init.mock.callCount(), 1);
    assert.equal(optOut.mock.callCount(), 1);

    setAnalyticsConsent("accepted");
    assert.equal(init.mock.callCount(), 1);
    const config = init.mock.calls[0].arguments[1]!;
    assert.equal(config.capture_pageview, "history_change");
    assert.equal(config.capture_pageleave, true);
    assert.equal(config.autocapture, true);
    assert.equal(config.capture_heatmaps, true);
    assert.equal(config.capture_dead_clicks, true);
    assert.equal(config.disable_session_recording, false);
    assert.equal(config.opt_out_capturing_by_default, false);
    assert.equal(config.opt_out_persistence_by_default, false);
    assert.deepEqual(config.capture_performance, { web_vitals: true, network_timing: true });
    assert.equal(config.session_recording?.maskAllInputs, true);
    assert.equal(config.session_recording?.recordBody, false);
    assert.equal(config.session_recording?.recordHeaders, false);
    const enrich = config.before_send;
    assert.equal(typeof enrich, "function");
    if (typeof enrich === "function") {
      const event = { uuid: "consent-test", event: "$pageleave", properties: { $current_url: "https://hangry-ui.dev/blocks/login" } };
      const enriched = enrich(event);
      assert.equal(enriched?.properties?.site_section, "blocks");
      assert.equal(enriched?.properties?.catalog_item, "login");
      assert.equal(enriched?.properties?.project_name, "Hangry UI");
      assert.equal(enrich(null), null);
    }
    assert.equal(values.get("hangry-ui-analytics-consent"), "accepted");
    setAnalyticsConsent("rejected");
    assert.equal(optOut.mock.callCount(), 2);
    setAnalyticsConsent("accepted");
    assert.equal(init.mock.callCount(), 1);
    assert.equal(optIn.mock.callCount(), 2);

    values.set("hangry-ui-analytics-consent", "rejected");
    const storageEvent = Object.assign(new Event("storage"), { key: "hangry-ui-analytics-consent" });
    browser.dispatchEvent(storageEvent);
    assert.equal(getAnalyticsConsent(), "rejected");
    assert.equal(optOut.mock.callCount(), 3);

    browser.localStorage.setItem = () => { throw new Error("Storage blocked"); };
    setAnalyticsConsent("accepted");
    assert.equal(getAnalyticsConsent(), "accepted");
    assert.equal(changed.mock.callCount(), 6);
    unsubscribe();
  } finally {
    mock.restoreAll();
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = previousKey;
    if (previousHost === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
    else process.env.NEXT_PUBLIC_POSTHOG_HOST = previousHost;
  }
});
