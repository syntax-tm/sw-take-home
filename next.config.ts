import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
  compiler: {
    styledComponents: true,
  },
  logging: {
    browserToTerminal: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
