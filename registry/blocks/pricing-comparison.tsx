"use client";

import { useId, useState, type ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "../components/table";

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

export function PricingComparison({ title = "A plan for every next step", description = "Start small. Make room as you grow.", defaultBilling = "monthly", plans = [{ name: "Starter", description: "For your next side project.", monthlyPrice: 0, yearlyPrice: 0, features: ["1 workspace", "Core components", "Community support"], href: "/signup", label: "Start for free" }, { name: "Pro", description: "For ideas ready to grow.", monthlyPrice: 19, yearlyPrice: 15, features: ["Unlimited workspaces", "All components and blocks", "Priority support"], href: "/signup?plan=pro", featured: true }, { name: "Team", description: "For building together.", monthlyPrice: 49, yearlyPrice: 39, features: ["Everything in Pro", "Team collaboration", "Dedicated support"], href: "/signup?plan=team" }], className, children, ...props }: PricingProps = {}) {
  const [billing, setBilling] = useState(defaultBilling);
  const id = useId();
  const actionClass = "inline-flex min-h-11 w-full items-center justify-center border border-border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring";
  function price(plan: (typeof plans)[number]) { return billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice; }
  return (<section {...props} aria-labelledby={props["aria-labelledby"] ?? `${id}-title`} data-slot="pricing" data-layout="comparison" className={cn("@container w-full space-y-8 text-foreground", className)}>
    <div className="text-center"><h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight">{title}</h2><p className="mt-3 text-sm text-muted-foreground">{description}</p></div>
    <div role="group" aria-label="Billing period" className="flex justify-center gap-1">
      <Button variant={billing === "monthly" ? "primary" : "secondary"} aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</Button>
      <Button variant={billing === "yearly" ? "primary" : "secondary"} aria-pressed={billing === "yearly"} onClick={() => setBilling("yearly")}>Yearly</Button>
    </div>
    <p aria-live="polite" className="text-center text-xs text-muted-foreground">{billing === "yearly" ? "Monthly prices shown. Billed once a year." : "Billed monthly. Switch to yearly for lower monthly prices."}</p>
    {<Table>
      <TableCaption>Compare plans. All prices are in USD.</TableCaption>
      <TableHeader><TableRow><TableHead>Plan</TableHead><TableHead>Price / month</TableHead><TableHead>Includes</TableHead><TableHead>Get started</TableHead></TableRow></TableHeader>
      <TableBody>{plans.map(plan => <TableRow key={plan.name} data-state={plan.featured ? "selected" : undefined}>
        <TableCell><span className="font-semibold">{plan.name}</span>{plan.featured && <div className="mt-2"><Badge variant="info">Popular</Badge></div>}</TableCell>
        <TableCell><span className="text-lg font-semibold">${price(plan)}</span>{billing === "yearly" && <p className="mt-1 text-xs text-muted-foreground">${price(plan) * 12} / year</p>}</TableCell>
        <TableCell><ul className="space-y-2">{plan.features.map(feature => <li key={feature} className="flex items-start gap-2"><Check size={14} aria-hidden="true" className="mt-1 shrink-0" />{feature}</li>)}</ul></TableCell>
        <TableCell><a href={plan.href} aria-label={`${plan.label ?? "Get started"} with ${plan.name}`} className={cn(actionClass, "whitespace-nowrap hover:bg-muted")}>{plan.label ?? "Get started"}</a></TableCell>
      </TableRow>)}</TableBody>
    </Table>}
    {children}
  </section>);
}
