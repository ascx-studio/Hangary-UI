"use client";

import type { ComponentProps } from "react";
import { PricingComparison as Block } from "./pricing";

export function PricingComparison(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
