import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Detail pages read registry source as text, without importing consumer code.
  outputFileTracingIncludes: {
    "/components/*": ["./registry/**/*"],
    "/blocks/*": ["./registry/**/*"],
    "/shader/*": ["./registry/**/*"],
    "/utils/*": ["./registry/**/*"],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async rewrites() {
    return posthogHost
      ? [{ source: "/ingest/:path*", destination: `${posthogHost}/:path*` }]
      : [];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
