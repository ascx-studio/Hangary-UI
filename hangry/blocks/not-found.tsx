import { memo } from "react";
import { NotFoundLayout, type NotFoundProps } from "@/hangry/blocks/not-found.shared";

export type { NotFoundProps } from "@/hangry/blocks/not-found.shared";

export const NotFound = memo(function NotFound(props: NotFoundProps = {}) {
  return <NotFoundLayout {...props} layout="centered" />;
});
