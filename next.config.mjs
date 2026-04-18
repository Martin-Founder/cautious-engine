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
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      ...config.experiments,
    }
    return config
  },
}

module.exports = nextConfig
