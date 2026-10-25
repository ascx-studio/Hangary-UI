import assert from "node:assert/strict";
import { toast, toastStore } from "../registry/components/toast-store";

toast.dismiss();
assert.deepEqual(toastStore.getServerSnapshot(), []);
const queued = toast("Queued before the host mounts");
assert.equal(toastStore.getSnapshot()[0].id, queued);

let updates = 0;
const unsubscribe = toastStore.subscribe(() => { updates += 1; });
const previous = toastStore.getSnapshot();
const success = toast.success("Saved", { description: "All done", duration: 0 });
assert.notEqual(toastStore.getSnapshot(), previous);
assert.equal(toastStore.getSnapshot(), toastStore.getSnapshot());
assert.equal(previous.length, 1);
assert.equal(updates, 1);
assert.equal(toastStore.getSnapshot()[0].variant, "success");
assert.equal(toastStore.getSnapshot()[0].duration, 0);

toast.info("Update");
const error = toast.error("Failed");
assert.equal(toastStore.getSnapshot().length, 3);
assert.equal(toastStore.getSnapshot()[0].id, error);
assert.equal(toastStore.getSnapshot().some(item => item.id === queued), false);
toast.dismiss(success);
assert.equal(toastStore.getSnapshot().length, 2);
assert.equal(toastStore.getSnapshot().some(item => item.id === error), true);
assert.deepEqual(toastStore.getServerSnapshot(), []);

unsubscribe();
const before = updates;
toast.dismiss();
assert.equal(updates, before);
assert.deepEqual(toastStore.getSnapshot(), []);
console.log("Toast store: subscriptions, pre-mount delivery, variants, limits, dismissal, and SSR snapshot pass.");
