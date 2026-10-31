"use client";

import { memo } from "react";
import { ConsentBanner } from "@/hangry/components/consent-banner";

const keepVisible = () => undefined;

export const ConsentBannerDemo = memo(function ConsentBannerDemo() {
  return (
    <div className="flex w-full justify-center">
      <ConsentBanner
        onAccept={keepVisible}
        onReject={keepVisible}
        onDismiss={keepVisible}
      />
    </div>
  );
});
