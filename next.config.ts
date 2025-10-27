import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // Vercelのデプロイでエラーを回避
  reactStrictMode: true,
};

export default nextConfig;
