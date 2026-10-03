"use client";

import type { ComponentProps } from "react";
import { NavbarFloating as Block } from "./navbar";

export function NavbarFloating(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
