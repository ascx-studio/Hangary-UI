"use client";

import { memo, useId } from "react";
import { X } from "lucide-react";
import { Button } from "@/registry/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/components/card";

type ConsentBannerProps = {
  onAccept: () => void;
  onReject: () => void;
  onDismiss?: () => void;
  title?: string;
  description?: string;
  className?: string;
};

export const ConsentBanner = memo(function ConsentBanner({
  onAccept,
  onReject,
  onDismiss,
  title = "Analytics",
  description = "Analytics and masked session replay help us improve this site.",
  className = "",
}: ConsentBannerProps) {
  const id = useId();

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      className={`w-full max-w-sm ${className}`}
    >
      <Card size="sm" className="max-w-none rounded-none bg-background shadow-xl">
        <CardHeader>
          <CardTitle id={`${id}-title`}>{title}</CardTitle>
          <CardDescription id={`${id}-description`}>{description}</CardDescription>
          {onDismiss && (
            <CardAction>
              <button
                type="button"
                aria-label="Dismiss analytics notice"
                onClick={onDismiss}
                className="inline-flex size-8 shrink-0 items-center justify-center border border-border text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-wrap gap-2 border-0 pt-0">
          <Button variant="secondary" onClick={onReject}>
            Reject analytics
          </Button>
          <Button variant="primary" onClick={onAccept}>
            Accept analytics
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
});
