"use client";

import { memo } from "react";
import { Outline, type OutlineProps } from "@/hangry/components/outline";

export type OutlineTrailProps = Omit<OutlineProps, "track">;

export const OutlineTrail = memo(function OutlineTrail(props: OutlineTrailProps) {
  return <Outline {...props} track="trail" />;
});
