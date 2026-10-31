"use client";

import { memo, type ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card } from "../components/card";

interface PricingFeaturedProps extends Omit<ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  plans?: {
    name: string;
    description: string;
    price: string;
    features: string[];
    href: string;
    label?: string;
    featured?: boolean;
  }[];
}

export const PricingFeatured = memo(function PricingFeatured({
  title = "Simple pricing for focused teams",
  description = "Choose the plan that fits how you build today.",
  plans = [
    {
      name: "Free",
      description: "For trying the essentials.",
      price: "$0",
      features: ["Core components", "One project", "Community support"],
      href: "/signup",
      label: "Start free",
    },
    {
      name: "Pro",
      description: "For teams ready to move faster.",
      price: "$24",
      features: ["Everything in Free", "Unlimited projects", "Priority support"],
      href: "/signup?plan=pro",
      label: "Choose Pro",
      featured: true,
    },
  ],
  className,
  children,
  ...props
}: PricingFeaturedProps = {}) {
  return (
    <section
      {...props}
      data-slot="pricing-featured"
      className={cn("@container w-full space-y-8 text-foreground", className)}
    >
      <header className="max-w-2xl">
        <h2 className="typography-section-title">{title}</h2>
        <p className="mt-3 typography-body">{description}</p>
      </header>
      <div className="grid gap-4 @lg:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            title=""
            description=""
            className={cn("max-w-none!", plan.featured && "border-primary shadow-lg")}
            footer={
              <Button
                href={plan.href}
                variant={plan.featured ? "primary" : "outline"}
                className="w-full"
                aria-label={`${plan.label ?? "Get started"} with ${plan.name}`}
              >
                {plan.label ?? "Get started"}
              </Button>
            }
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="typography-subsection-title">{plan.name}</h3>
                  {plan.featured && <Badge variant="info">Recommended</Badge>}
                </div>
                <p className="mt-2 typography-body">{plan.description}</p>
                <p className="mt-5">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-secondary dark:text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
      {children}
    </section>
  );
});
