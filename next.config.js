/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverActions: {
      // Enable server actions with proper configuration
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
  },
  // Configure logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Configure webpack for better HMR
  webpack: (config, { dev, isServer }) => {
    // Optimize builds
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }
    config.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
    }
    return config
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
