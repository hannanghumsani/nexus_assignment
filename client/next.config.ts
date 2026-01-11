/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // Security & minor size reduction
  compress: true, // Crucial for 95+ score
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Strips console logs
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'chart.js'], // Tree-shaking optimization
  },
};

module.exports = nextConfig;