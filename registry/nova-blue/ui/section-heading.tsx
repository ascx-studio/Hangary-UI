import React from "react";
import { cn } from '../lib/utils'


interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionHeading({
  children,
  className,
}: Readonly<SectionHeadingProps>) {
  return (
    <p
      className={cn(
        "text-3xl font-medium mb-4 ",
        className,
      )}
    >
      {children}
    </p>
  );
}
