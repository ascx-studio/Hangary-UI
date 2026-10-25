import { memo, useId, type ComponentProps, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "cn";
import { Card } from "../components/card";
import { typography } from "../lib/typography.shared";

export interface FaqItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface FaqProps extends Omit<ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  items?: readonly FaqItem[];
  multiple?: boolean;
  defaultOpenId?: string;
}

const defaultItems: readonly FaqItem[] = [
  { id: "start", question: "How do I get started?", answer: "Choose a component, follow its installation steps, and add it to your page. Start small and make it your own." },
  { id: "customize", question: "Can I customize the design?", answer: "Yes. Update the content, adjust the Tailwind classes, and use your own theme tokens. The source lives in your project." },
  { id: "mobile", question: "Does it work on smaller screens?", answer: "The layout adapts to the space available. Questions wrap naturally, and answers remain readable on phones and tablets." },
  { id: "content", question: "Can answers include more than text?", answer: "Absolutely. Pass React content to include links, lists, images, or other components in an answer." },
];

const FaqEntry = memo(function FaqEntry({ item, name, defaultOpen, card }: {
  item: FaqItem;
  name?: string;
  defaultOpen: boolean;
  card: boolean;
}) {
  const content = (
    <details name={name} open={defaultOpen || undefined} className="group/faq">
      <summary className="cursor-pointer list-none px-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <h3 className={cn(typography.subsectionTitle, "flex items-start justify-between gap-5")}>
          <span>{item.question}</span>
          <Plus aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground group-open/faq:rotate-45 group-open/faq:text-foreground" />
        </h3>
      </summary>
      <div className={cn("px-5 pb-5", typography.body)}>{item.answer}</div>
    </details>
  );

  return card
    ? <Card title="" description="" className="w-full! max-w-none! p-0! shadow-none!">{content}</Card>
    : content;
});

export const FaqLayout = memo(function FaqLayout({
  title = "A few things you might be wondering.",
  description = "The details, without the guesswork.",
  items = defaultItems,
  layout = "list",
  multiple = false,
  defaultOpenId,
  className,
  ...props
}: FaqProps & { layout?: "list" | "cards" | "split" } = {}) {
  const id = useId();
  const split = layout === "split";

  return (
    <section
      data-slot="faq"
      data-layout={layout}
      {...props}
      aria-labelledby={props["aria-labelledby"] ?? `${id}-title`}
      className={cn("@container w-full text-foreground", className)}
    >
      <div className={split ? "grid items-start gap-8 @3xl:grid-cols-[2fr_3fr]" : "space-y-8"}>
      <header className={split ? "space-y-3" : "mx-auto max-w-xl space-y-3 text-center"}>
        <h2 id={`${id}-title`} className={typography.sectionTitle}>{title}</h2>
        {description && <p className={typography.body}>{description}</p>}
      </header>
      <div className={layout === "cards" ? "grid gap-3" : "divide-y divide-border border-y border-border"}>
        {items.map(item => (
          <FaqEntry key={item.id} item={item} name={multiple ? undefined : `${id}-questions`} defaultOpen={item.id === defaultOpenId} card={layout === "cards"} />
        ))}
      </div>
      </div>
    </section>
  );
});
