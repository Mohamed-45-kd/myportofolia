import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/experience", destination: "/journey#experience", permanent: false },
      { source: "/education", destination: "/journey#education", permanent: false },
      { source: "/achievements", destination: "/journey#achievements", permanent: false },
      { source: "/mission", destination: "/about#mission", permanent: false },
    ];
  },
};

export default nextConfig;
