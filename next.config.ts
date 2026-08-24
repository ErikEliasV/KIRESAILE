import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        // /media/** is our own static folder, never user input — every
        // request carries a ?v=<mtime> cache-buster (see lib/asset-version),
        // so all query strings need to be allowed here.
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
