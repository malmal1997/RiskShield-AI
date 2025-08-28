/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'zod/v4': 'zod',
      'zod/v3': 'zod',
    }
    
    // Exclude AI SDK from client bundle during static build
    if (!config.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'ai': false,
        '@ai-sdk/google': false,
        '@ai-sdk/provider-utils': false,
      }
    }
    
    return config
  },
}

export default nextConfig