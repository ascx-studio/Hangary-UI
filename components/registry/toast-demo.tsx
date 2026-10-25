"use client";

import { memo } from "react";
import { toast } from "@/registry/components/toast";
import { Button } from "@/registry/components/button";
import { typography } from "@/registry/lib/typography.shared";

const messages = { neutral: "A little update for you.", info: "A new update is available.", success: "Your changes have been saved.", warning: "Your session expires soon.", error: "We couldn’t save your changes." };

export const ToastDemo = memo(function ToastDemo() {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {(["neutral", "info", "success", "warning", "error"] as const).map(variant => (
          <Button key={variant} variant="ghost" onClick={() => toast[variant](messages[variant], { description: "Hover or focus the stack to expand." })} className="capitalize">{variant}</Button>
        ))}
      </div>
      <p className={`text-center ${typography.body}`}>Click a status to show a notification. Click again to stack more in the bottom corner.</p>
    </div>
  );
});
