import { memo } from "react";
import { FaqLayout, type FaqProps } from "@/hangry/blocks/faq.shared";

export type { FaqItem, FaqProps } from "@/hangry/blocks/faq.shared";

export const Faq = memo(function Faq(props: FaqProps = {}) {
  return <FaqLayout {...props} layout="list" />;
});
