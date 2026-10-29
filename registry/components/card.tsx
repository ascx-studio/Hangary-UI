import { memo, type ComponentProps, type ReactNode } from "react";
import { cn } from "cn";

// Legacy content props remain supported for existing consumers.
const cardSizes = {
  sm: "gap-4 px-4 py-4",
  md: "gap-6 px-6 py-6",
} as const;

type CardProps = {
  size?: keyof typeof cardSizes;
  title?: string;
  description?: string;
  footer?: ReactNode;
} & (
  | ({ as?: "article" } & Omit<ComponentProps<"article">, "title">)
  | ({ as: "a" } & Omit<ComponentProps<"a">, "title">)
);

const Card = memo(function Card({
  title,
  description,
  children,
  footer,
  className,
  size = "md",
  ...props
}: CardProps) {
  const hasLegacyContent = Boolean(title || description || footer);
  const classes = cn(
    "group/card flex w-full max-w-sm flex-col rounded-lg border border-border bg-card text-base leading-7 shadow-md inset-shadow-sm inset-shadow-foreground/5",
    "outline-ring focus-visible:outline-[length:var(--focus-ring-width,2px)] focus-visible:outline-offset-[var(--focus-ring-offset,2px)]",
    "[a&]:transition-colors [a&]:duration-[var(--duration-fast,150ms)] [a&]:ease-out [a&]:hover:bg-muted motion-reduce:transition-none",
    cardSizes[size],
    className,
  );
  const content = (
    <>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {hasLegacyContent ? children && <CardContent>{children}</CardContent> : children}
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  );
  if (props.as === "a") {
    const { as: Tag, ...anchorProps } = props;
    return (
      <Tag data-slot="card" data-size={size} className={classes} {...anchorProps}>
        {content}
      </Tag>
    );
  }
  const { as: Tag = "article", ...articleProps } = props;
  return (
    <Tag data-slot="card" data-size={size} className={classes} {...articleProps}>
      {content}
    </Tag>
  );
});

const CardHeader = memo(function CardHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-x-4 gap-y-2 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
});

const CardTitle = memo(function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 data-slot="card-title" className={cn("typography-section-title", className)} {...props} />
  );
});

const CardDescription = memo(function CardDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("col-start-1", "typography-body", className)}
      {...props}
    />
  );
});

const CardAction = memo(function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
});

const CardContent = memo(function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={className} {...props} />;
});

const CardFooter = memo(function CardFooter({ className, ...props }: ComponentProps<"footer">) {
  return (
    <footer
      data-slot="card-footer"
      className={cn("flex items-center border-t border-border pt-4", className)}
      {...props}
    />
  );
});

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
