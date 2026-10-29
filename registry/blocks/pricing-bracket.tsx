"use client";

import { memo, type ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "cn";
import { BracketCard } from "../components/bracket-card";
import { Button } from "../components/button";

export const PricingBracket = memo(function PricingBracket({
  title = "Plans with room to grow",
  description = "A focused set of plans for independent builders and teams.",
  className,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  title?: string;
  description?: string;
} = {}) {
  const plans = [
    { name: "Builder", price: "$12", features: ["Unlimited drafts", "Core blocks"] },
    { name: "Studio", price: "$32", features: ["Unlimited projects", "Priority support"] },
  ];

  return (
    <section {...props} className={cn("@container w-full space-y-8", className)}>
      <header className="text-center">
        <h2 className="typography-section-title">{title}</h2>
        <p className="mt-3 typography-body">{description}</p>
      </header>
      <div className="grid gap-4 @lg:grid-cols-2">
        {plans.map((plan) => (
          <BracketCard key={plan.name}>
            <h3 className="typography-subsection-title">{plan.name}</h3>
            <p className="mt-4 text-4xl font-semibold">
              {plan.price}
              <span className="text-sm text-muted-foreground"> / month</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check size={16} className="mt-0.5 text-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="/signup" variant="outline" className="mt-8 w-full">
              Choose {plan.name}
            </Button>
          </BracketCard>
        ))}
      </div>
    </section>
  );
});
