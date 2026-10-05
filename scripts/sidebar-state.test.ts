import assert from "node:assert/strict";
import { test } from "node:test";
import { getSidebarOpen, getServerSidebarOpen, setSidebarOpen, subscribeSidebarOpen } from "../lib/sidebar-state";

test("sidebar preference survives remounts and saved-state reads, including blocked storage", () => {
  const values = new Map<string, string>();
  const browser = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    },
  });
  const previousWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
  let updates = 0;
  const unsubscribe = subscribeSidebarOpen(() => { updates++; });
  const storageChanged = () => browser.dispatchEvent(Object.assign(new Event("storage"), { key: "hangry-ui-sidebar-open" }));
  try {
    assert.equal(getServerSidebarOpen(), false);
    assert.equal(getSidebarOpen(), true);
    setSidebarOpen(false);
    assert.equal(values.get("hangry-ui-sidebar-open"), "false");
    assert.equal(getSidebarOpen(), false);
    storageChanged();
    assert.equal(getSidebarOpen(), false);
    values.set("hangry-ui-sidebar-open", "true");
    storageChanged();
    assert.equal(getSidebarOpen(), true);
    browser.localStorage.setItem = () => { throw new Error("Storage blocked"); };
    setSidebarOpen(false);
    assert.equal(getSidebarOpen(), false);
    assert.equal(updates, 4);
    unsubscribe();
    const remounted = subscribeSidebarOpen(() => {});
    assert.equal(getSidebarOpen(), false);
    remounted();
  } finally {
    unsubscribe();
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});
