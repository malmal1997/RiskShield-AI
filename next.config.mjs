/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
