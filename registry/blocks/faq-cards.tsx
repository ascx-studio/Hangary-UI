import { memo } from "react";
import { FaqLayout, type FaqProps } from "./faq.shared";

export type { FaqItem, FaqProps } from "./faq.shared";

export const FaqCards = memo(function FaqCards(props: FaqProps = {}) {
  return <FaqLayout {...props} layout="cards" />;
});
