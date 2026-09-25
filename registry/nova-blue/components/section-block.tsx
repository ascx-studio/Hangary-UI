import React from "react";
import SectionHeading from "../../ui/portfolio/section-heading";

interface SectionBlockProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function SectionBlock({
  title,
  description,
  children,
}: Readonly<SectionBlockProps>) {
  return (
    <div className="mb-10">
      <div className="flex flex-col gap-1">
        <SectionHeading>{title}</SectionHeading>
        <p className="text-foreground-secondary max-w-2xl text-lg font-light leading-relaxed">{description}</p>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
