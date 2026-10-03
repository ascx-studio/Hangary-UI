"use client";

import type { ComponentProps } from "react";
import { PricingCompact as Block } from "./pricing";

export function PricingCompact(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
