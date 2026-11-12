import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "motion"],
  },
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app", "localhost:3000"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
