import { memo, type ReactNode } from "react";

const DocsPageEntrance = memo(function DocsPageEntrance({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={className}>{children}</article>;
});

export default DocsPageEntrance;
