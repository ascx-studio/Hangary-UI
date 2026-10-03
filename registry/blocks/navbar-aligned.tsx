"use client";

import type { ComponentProps } from "react";
import { NavbarAligned as Block } from "./navbar";

export function NavbarAligned(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
