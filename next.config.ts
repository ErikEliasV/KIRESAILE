import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/KIRESAILE" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    // GitHub Pages has no server to run the Next.js image optimizer —
    // serve local media as-is instead.
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
