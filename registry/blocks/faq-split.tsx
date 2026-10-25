import { memo } from "react";
import { FaqLayout, type FaqProps } from "./faq.shared";

export type { FaqItem, FaqProps } from "./faq.shared";

export const FaqSplit = memo(function FaqSplit(props: FaqProps = {}) {
  return <FaqLayout {...props} layout="split" />;
});
