import type { ComponentProps } from "react";
import { FooterStacked as Block } from "./footer";

export function FooterStacked(props: ComponentProps<typeof Block>) {
  return <Block {...props} />;
}
