import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Detail pages read registry source as text, without importing consumer code.
  outputFileTracingIncludes: {
    '/components/*': ['./registry/**/*'],
    '/blocks/*': ['./registry/**/*'],
    '/shader/*': ['./registry/**/*'],
    '/utils/*': ['./registry/**/*'],
  },
};

export default nextConfig;
