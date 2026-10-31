"use client";

import { memo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "@/registry/components/tabs";

export const CatalogTabs = memo(function CatalogTabs({
  filters,
  children,
}: {
  filters: string[];
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("type");
  const selected = requested && filters.includes(requested) ? requested : "All";

  return (
    <Tabs
      value={selected}
      onValueChange={(value) => {
        const url = new URL(window.location.href);
        if (value === "All") url.searchParams.delete("type");
        else url.searchParams.set("type", value);
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }}
      className="mt-8"
    >
      {children}
    </Tabs>
  );
});
