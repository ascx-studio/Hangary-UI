"use client";

import { useId, useState, type ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/hangry/components/badge";
import { Card } from "@/hangry/components/card";
import { Button } from "@/hangry/components/button";

interface PricingProps extends Omit<ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  defaultBilling?: "monthly" | "yearly";
  plans?: {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    href: string;
    label?: string;
    featured?: boolean;
  }[];
}

export function PricingCompact({
  title = "A plan for every next step",
  description = "Start small. Make room as you grow.",
  defaultBilling = "monthly",
  plans = [
    {
      name: "Starter",
      description: "For your next side project.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ["1 workspace", "Core components", "Community support"],
      href: "/signup",
      label: "Start for free",
    },
    {
      name: "Pro",
      description: "For ideas ready to grow.",
      monthlyPrice: 19,
      yearlyPrice: 15,
      features: ["Unlimited workspaces", "All components and blocks", "Priority support"],
      href: "/signup?plan=pro",
      featured: true,
    },
    {
      name: "Team",
      description: "For building together.",
      monthlyPrice: 49,
      yearlyPrice: 39,
      features: ["Everything in Pro", "Team collaboration", "Dedicated support"],
      href: "/signup?plan=team",
    },
  ],
  className,
  children,
  ...props
}: PricingProps = {}) {
  const [billing, setBilling] = useState(defaultBilling);
  const id = useId();
  const actionClass =
    "inline-flex min-h-11 w-full items-center justify-center border border-border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring";
  function price(plan: (typeof plans)[number]) {
    return billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  }
  return (
    <section
      {...props}
      aria-labelledby={props["aria-labelledby"] ?? `${id}-title`}
      data-slot="pricing"
      data-layout="compact"
      className={cn("@container w-full space-y-8 text-foreground", className)}
    >
      <div className="text-center">
        <h2 id={`${id}-title`} className={"typography-section-title"}>
          {title}
        </h2>
        <p className={`mt-3 typography-body`}>{description}</p>
      </div>
      <div role="group" aria-label="Billing period" className="flex justify-center gap-1">
        <Button
          variant={billing === "monthly" ? "primary" : "secondary"}
          aria-pressed={billing === "monthly"}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={billing === "yearly" ? "primary" : "secondary"}
          aria-pressed={billing === "yearly"}
          onClick={() => setBilling("yearly")}
        >
          Yearly
        </Button>
      </div>
      <p aria-live="polite" className="text-center text-xs text-muted-foreground">
        {billing === "yearly"
          ? "Monthly prices shown. Billed once a year."
          : "Billed monthly. Switch to yearly for lower monthly prices."}
      </p>
      {
        <div className={cn("grid gap-4", "grid-cols-1")}>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              title=""
              description=""
              className={cn("max-w-none!", plan.featured && "border-primary")}
            >
              <div className="grid items-center gap-6 @xl:grid-cols-[1fr_1.5fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className={"typography-subsection-title"}>{plan.name}</h3>
                    {plan.featured && <Badge variant="info">Popular</Badge>}
                  </div>
                  <p className={`mt-2 typography-body`}>{plan.description}</p>
                  <p className="mt-5">
                    <span className="text-3xl font-semibold">${price(plan)}</span>
                    <span className="text-xs text-muted-foreground"> / month</span>
                  </p>
                  {billing === "yearly" && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ${price(plan) * 12} billed yearly
                    </p>
                  )}
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        size={16}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-secondary dark:text-primary"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {
                  <a
                    href={plan.href}
                    aria-label={`${plan.label ?? "Get started"} with ${plan.name}`}
                    className={cn(
                      actionClass,
                      "w-auto whitespace-nowrap",
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-muted",
                    )}
                  >
                    {plan.label ?? "Get started"}
                  </a>
                }
              </div>
            </Card>
          ))}
        </div>
      }
      {children}
    </section>
  );
}
