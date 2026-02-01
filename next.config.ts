import type { NextConfig } from "next";

const desmondBuild = process.env.DESMOND_BUILD === 'true';
const basePath = process.env.NODE_ENV === 'production' ? (desmondBuild ? '/gamejam2026' : '') : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath,
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
