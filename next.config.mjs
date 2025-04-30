/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
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
