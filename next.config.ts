import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  /* config options here */
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "roam.qodeinteractive.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.voltatrips.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
