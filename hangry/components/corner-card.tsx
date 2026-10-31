import { memo, type ComponentProps } from "react";
import { BracketCard } from "./bracket-card";

export const CornerCard = memo(function CornerCard(props: ComponentProps<"div"> = {}) {
  return <BracketCard data-slot="corner-card" {...props} variant="corners" />;
});
