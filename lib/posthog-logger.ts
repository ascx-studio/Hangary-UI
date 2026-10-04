import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogLoggerProvider } from "@/instrumentation";

const catalogLogger = posthogLoggerProvider?.getLogger("posthog-catalog");

type CatalogType = "blocks" | "components";

export function logCatalogDetailRendered(catalog: CatalogType, itemSlug: string) {
  catalogLogger?.emit({
    body: "Catalog detail page rendered",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      catalog,
      item_slug: itemSlug,
    },
  });
}
