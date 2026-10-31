"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { Copy, LoaderCircle, Nfc, Share } from "lucide-react";
import { ClaudeAI, GrokDark, OpenAIDark, XDark } from "@ridemountainpig/svgl-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import { toast } from "@/hangry/components/toast";

type NfcReader = {
  write: (
    message: { records: { recordType: string; data: string }[] },
    options: { signal: AbortSignal },
  ) => Promise<void>;
};
const getNfcReader = () => (window as unknown as { NDEFReader?: new () => NfcReader }).NDEFReader;

type ShareMenuProps = {
  title?: string;
  url?: string;
  text?: string;
  pageUrl?: string;
  pageContent?: string;
  className?: string;
};

export const ShareMenu = memo(function ShareMenu({
  title,
  url,
  text,
  pageUrl,
  pageContent = "",
  className = "",
}: ShareMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const [nfcAvailable, setNfcAvailable] = useState(false);
  const [writingNfc, setWritingNfc] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const controller = useRef<AbortController | null>(null);
  const reduced = useReducedMotion();
  const menuId = useId();
  const [currentUrl, setCurrentUrl] = useState("");
  const shareUrl = pageUrl ?? url ?? currentUrl;
  const content = text ?? pageContent;
  const markdownUrl = shareUrl ? `${shareUrl.split(/[?#]/)[0].replace(/\/$/, "")}/llms.txt` : "";
  const prompt = encodeURIComponent(
    `Read ${markdownUrl} so you have context on this page, then help me with it.`,
  );

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      controller.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (open) root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setOpen(false);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  async function share() {
    if (!navigator.share) {
      toast.info(
        "Sharing with other apps is not supported by this browser. Use Copy link instead.",
      );
      return;
    }
    try {
      await navigator.share({ title: title ?? document.title, text: content, url: shareUrl });
      setOpen(false);
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        toast.error("Could not share this page.");
    }
  }

  async function shareNfc() {
    if (controller.current) {
      controller.current.abort();
      return;
    }
    const Reader = getNfcReader();
    if (!Reader) return;
    const active = new AbortController();
    controller.current = active;
    setWritingNfc(true);
    const notice = toast.info("Hold your phone near a writable NFC tag.", { duration: 0 });
    try {
      await new Reader().write(
        { records: [{ recordType: "url", data: shareUrl }] },
        { signal: active.signal },
      );
      toast.success("Link written to the NFC tag!");
      setOpen(false);
    } catch (error) {
      if (!active.signal.aborted)
        toast.error(
          error instanceof Error && error.name === "NotAllowedError"
            ? "Allow NFC access to share this page."
            : "Could not write the link. Turn on NFC and try a writable tag.",
        );
    } finally {
      toast.dismiss(notice);
      controller.current = null;
      setWritingNfc(false);
    }
  }

  const items = [
    {
      label: "Share on X",
      icon: XDark,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title ?? "Check out this page")}&url=${encodeURIComponent(shareUrl)}`,
    },
    { label: "Open in ChatGPT", icon: OpenAIDark, href: `https://chatgpt.com/?q=${prompt}` },
    { label: "Open in Claude", icon: ClaudeAI, href: `https://claude.ai/new?q=${prompt}` },
    { label: "Open in Grok", icon: GrokDark, href: `https://grok.com/?q=${prompt}` },
  ];
  const row =
    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:outline-none";

  return (
    <div
      ref={root}
      className={`relative inline-flex items-center font-mono ${className}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
        if (open && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const entries = Array.from(
            root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
          );
          const index = entries.indexOf(document.activeElement as HTMLElement);
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? entries.length - 1
                : (index + (event.key === "ArrowUp" ? -1 : 1) + entries.length) % entries.length;
          entries[next]?.focus();
        }
      }}
    >
      <motion.button
        ref={toggle}
        type="button"
        onClick={() => {
          setNfcAvailable(getNfcReader() !== undefined);
          setOpen((value) => !value);
        }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Share"
        title="Share"
        className="flex size-9 items-center justify-center rounded-md surface-raised [--surface-color:var(--muted)] text-foreground hover:[--surface-bottom:color-mix(in_srgb,var(--secondary)_18%,var(--card))] hover:text-foreground"
      >
        <Share className="size-3.5" aria-hidden="true" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Share options"
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6, scale: reduced ? 1 : 0.97 }}
            transition={{ duration: reduced ? 0 : 0.12 }}
            className="absolute top-[calc(100%+6px)] z-50 min-w-55 rounded-lg surface-raised [--surface-color:var(--popover)] py-1.5"
          >
            <button type="button" role="menuitem" onClick={copyLink} className={row}>
              <Copy className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              Copy link
            </button>
            {items.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={row}
              >
                <Icon
                  className={`size-4 shrink-0 text-muted-foreground ${Icon === ClaudeAI ? "" : "invert dark:invert-0"}`}
                  aria-hidden="true"
                />
                {label}
              </a>
            ))}
            {nfcAvailable && (
              <button type="button" role="menuitem" onClick={shareNfc} className={row}>
                {writingNfc ? (
                  <motion.span
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <LoaderCircle className="size-4 text-muted-foreground" />
                  </motion.span>
                ) : (
                  <Nfc className="size-4 text-muted-foreground" />
                )}
                {writingNfc ? "Cancel NFC sharing" : "Share with NFC"}
              </button>
            )}
            <button type="button" role="menuitem" onClick={share} className={row}>
              <Share className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              Other apps
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
