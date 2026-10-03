"use client";

import type { ComponentProps } from "react";
import { LoginMinimal as Block } from "./login";

export function LoginMinimal(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
