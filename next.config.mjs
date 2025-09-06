/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds in development, not production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // Only ignore build errors in development, not production
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    skipTrailingSlashRedirect: true,
  },
  async generateBuildId() {
    return 'build-' + Date.now()
  },
  async rewrites() {
    return []
  },
  async headers() {
    return [
      {
        source: '/risk-assessment/ai-assessment',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
