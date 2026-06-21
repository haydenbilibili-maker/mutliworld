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
  // 仅 /embed 路由显式放开 iframe 嵌入（其余路由保持默认，不被第三方框架嵌套）
  async headers() {
    return [
      {
        source: '/embed',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *;' },
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
        ],
      },
    ];
  },
};

export default nextConfig;
