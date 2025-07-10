/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  env: {
    generateStatic: process.env.GENERATE_STATIC || 'false',
  },
  transpilePackages: ['@workspace/ui'],
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole: isProd,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'd.cobo.com',
      },
      {
        hostname: '*.bdy.tech',
      },
      {
        hostname: 'dummyimage.com',
      },
    ],
  },
}

export default nextConfig
