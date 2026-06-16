/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['maplibre-gl'],
  webpack: (config, { dev }) => {
    // 避免多 dev 进程或路径含空格时 webpack 持久缓存损坏导致 chunk 500
    if (dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
