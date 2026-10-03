"use client";

import type { ComponentProps } from "react";
import { LoginSplit as Block } from "./login";

export function LoginSplit(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
