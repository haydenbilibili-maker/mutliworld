/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['maplibre-gl'],
  experimental: {
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
