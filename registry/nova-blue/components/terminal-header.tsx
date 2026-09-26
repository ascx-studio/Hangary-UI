import { cn } from '../lib/utils'

import React from "react";

export default function TerminalHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="block group h-full border group transition-colors duration-normal   hover:bg-white/2 p-6 border-border hover:border-primary/50">
      <div
        className={cn(
          className,
          "flex items-center gap-2 mb-6 border-b pb-4 border-zinc-900",
        )}
      >
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-primary" />
          <div className="w-2 h-2 bg-zinc-500" />
          <div className="w-2 h-2 bg-zinc-700" />
        </div>
        {children && <div className="ml-3">{children}</div>}
      </div>
    </div>
  );
}
