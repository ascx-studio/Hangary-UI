const storageKey = "hangry-ui-sidebar-open";
const changeEvent = "sidebar-state-change";
let sessionOpen: boolean | undefined;

export function getSidebarOpen() {
  if (sessionOpen !== undefined) return sessionOpen;
  try {
    return window.localStorage.getItem(storageKey) !== "false";
  } catch {
    return true;
  }
}

// Keep the expanded sidebar hidden until the browser reads its saved state.
export function getServerSidebarOpen() {
  return false;
}

export function setSidebarOpen(open: boolean) {
  sessionOpen = open;
  try {
    window.localStorage.setItem(storageKey, String(open));
  } catch {
    // Preserve the choice across navigation even when storage is blocked.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeSidebarOpen(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    sessionOpen = undefined;
    onChange();
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
