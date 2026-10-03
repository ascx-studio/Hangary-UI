import type { ComponentProps } from "react";
import { FooterMinimal as Block } from "./footer";

export function FooterMinimal(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
