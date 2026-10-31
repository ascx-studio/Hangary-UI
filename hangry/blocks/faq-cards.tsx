import { memo } from "react";
import { FaqLayout, type FaqProps } from "@/hangry/blocks/faq.shared";

export type { FaqItem, FaqProps } from "@/hangry/blocks/faq.shared";

export const FaqCards = memo(function FaqCards(props: FaqProps = {}) {
  return <FaqLayout {...props} layout="cards" />;
});
