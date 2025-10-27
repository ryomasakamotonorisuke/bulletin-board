import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的エクスポート（Xserver対応）
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
