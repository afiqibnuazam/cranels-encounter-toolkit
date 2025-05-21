import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["www.dnd5eapi.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.dnd5eapi.co",
      }
    ]
  }
};

export default nextConfig;
