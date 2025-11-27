/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' ws: wss: https://www.clarity.ms; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://www.clarity.ms; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'mongodb' module on the client to prevent this error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongodb: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'mongodb-client-encryption': false,
        'aws4': false,
        'snappy': false,
        '@mongodb-js/zstd': false,
        'kerberos': false,
        'supports-color': false,
        'util': false,
        'timers/promises': false,
        'node:events': false,
        'node:stream': false,
        'node:util': false,
        'node:buffer': false,
        'node:path': false,
        'node:process': false,
        'node:url': false,
        'node:crypto': false,
        'node:http': false,
        'node:https': false,
        'node:net': false,
        'node:tls': false,
        'node:dns': false,
        'node:fs': false,
        'node:zlib': false,
        'node:os': false,
        'node:stream/web': false,
        'node:worker_threads': false,
      }
    }
    return config
  },
}

export default nextConfig
