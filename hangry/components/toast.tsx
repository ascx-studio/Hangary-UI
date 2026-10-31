"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";
import { toast, toastStore, type ToastVariant } from "./toast-store";

export { toast } from "./toast-store";
export type { ToastOptions, ToastVariant } from "./toast-store";

interface ToastProps {
  message?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  paused?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: ReactNode;
  className?: string;
}

const statuses = {
  neutral: { icon: Info, color: "text-muted-foreground" },
  info: { icon: Info, color: "text-sky-700 dark:text-sky-400" },
  success: { icon: CircleCheck, color: "text-emerald-700 dark:text-emerald-400" },
  warning: { icon: TriangleAlert, color: "text-amber-700 dark:text-amber-400" },
  error: { icon: CircleX, color: "text-red-700 dark:text-red-400" },
};

export const Toast = memo(function Toast({
  message = "Your changes have been saved.",
  description = "Everything is up to date.",
  variant = "success",
  duration = 5000,
  paused: pauseTimer = false,
  open,
  onOpenChange,
  action,
  className = "",
}: ToastProps = {}) {
  const [visible, setVisible] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const paused = pauseTimer || interacting;
  const isOpen = open ?? visible;
  const remaining = useRef(duration);
  const reducedMotion = useReducedMotion();
  const { icon: Icon, color } = statuses[variant];
  const dismiss = useCallback(() => {
    setVisible(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    remaining.current = duration;
  }, [duration, isOpen, message]);
  useEffect(() => {
    if (!isOpen || paused || duration <= 0) return;
    const started = Date.now();
    const timer = window.setTimeout(dismiss, Math.max(0, remaining.current));
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [isOpen, paused, duration, message, dismiss]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.98 }}
          transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
          onPointerEnter={() => setInteracting(true)}
          onPointerLeave={(event) => {
            if (!event.currentTarget.contains(document.activeElement)) setInteracting(false);
          }}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget) &&
              !event.currentTarget.matches(":hover")
            )
              setInteracting(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              dismiss();
            }
          }}
          className={`w-full max-w-sm ${className}`}
        >
          <Card title="" description="" className="h-full w-full! max-w-none! p-4!">
            <div className="flex items-start gap-3">
              <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${color}`} />
              <div
                className="min-w-0 flex-1"
                role={variant === "error" ? "alert" : "status"}
                aria-atomic="true"
              >
                <p className="text-base font-medium leading-6 text-foreground">{message}</p>
                {description && <p className={`mt-1 typography-body`}>{description}</p>}
              </div>
              <Button
                variant="ghost"
                aria-label="Dismiss notification"
                onClick={dismiss}
                className="-mr-1 -mt-1 size-9 min-h-0! shrink-0 p-0!"
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            {action && <div className="mt-3 pl-8">{action}</div>}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

const getDocumentHidden = () => document.hidden;
const getServerHidden = () => false;

export const Toaster = memo(function Toaster() {
  const notifications = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  const documentHidden = useSyncExternalStore(
    subscribeVisibility,
    getDocumentHidden,
    getServerHidden,
  );
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  // A new batch must not inherit the previous stack's interaction state.
  if (notifications.length === 0 && expanded) setExpanded(false);

  return (
    <aside
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] mx-auto w-auto max-w-sm sm:left-auto sm:mx-0 sm:w-96"
    >
      <div
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={(event) => {
          if (!event.currentTarget.contains(document.activeElement)) setExpanded(false);
        }}
        onFocusCapture={() => setExpanded(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget) &&
            !event.currentTarget.matches(":hover")
          )
            setExpanded(false);
        }}
        className={`relative grid items-end gap-3 pt-8 ${notifications.length ? "pointer-events-auto" : ""}`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {notifications.map((notification, depth) => (
            <motion.div
              key={notification.id}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: expanded ? 0 : -depth * 14,
                scale: expanded ? 1 : 1 - depth * 0.05,
              }}
              exit={{
                opacity: 0,
                y: reducedMotion ? 0 : 8,
                transition: { duration: reducedMotion ? 0 : 0.2, ease: "easeOut" },
              }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 280, damping: 30, opacity: { duration: 0.2 } }
              }
              style={{ zIndex: 3 - depth, order: -depth, transformOrigin: "center bottom" }}
              className={`min-h-0 min-w-0 ${expanded ? "[grid-area:auto]" : `[grid-area:1/1] ${depth ? "h-full overflow-hidden [contain:size]" : ""}`}`}
            >
              <Toast
                {...notification}
                open
                variant={notification.variant ?? "neutral"}
                description={notification.description ?? ""}
                paused={expanded || documentHidden}
                className="h-full"
                onOpenChange={(open) => {
                  if (!open) toast.dismiss(notification.id);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
});
