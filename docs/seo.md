# Search visibility

Metadata, canonical URLs, robots rules, and the sitemap use the production
homepage in `registry.json`. The existing social image is shared by Open Graph
and Twitter cards. The homepage includes website structured data; documentation
pages include breadcrumbs.

1. Add `https://ui.razeev.com/` as a URL-prefix property in Google Search Console.
2. For HTML-tag verification, set `GOOGLE_SITE_VERIFICATION` in the deployment
   environment to the `content` token from Google's tag, then deploy. DNS-verified
   domain properties do not need this environment variable.
3. Verify ownership and submit `https://ui.razeev.com/sitemap.xml`.
4. Monitor queries, impressions, clicks, CTR, indexing, and Core Web Vitals.
5. In PostHog Web Analytics, filter by **Organic Search**. Use a
   `$pageview` → `code_copied` funnel broken down by `catalog_item` to measure
   which documentation pages lead to component use.

Search Console ownership verification and sitemap submission happen in Google's
dashboard; adding metadata does not complete those steps or guarantee rankings.

References: [Search Console verification](https://support.google.com/webmasters/answer/9008080),
[search performance](https://support.google.com/webmasters/answer/10268906),
[PostHog channels](https://posthog.com/docs/web-analytics/dashboard).
