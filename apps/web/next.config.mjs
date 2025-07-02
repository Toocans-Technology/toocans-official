/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    generateStatic: process.env.GENERATE_STATIC || 'false',
  },
  transpilePackages: ['@workspace/ui'],
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: 'd.cobo.com',
      },
      {
        hostname: '*.bdy.tech',
      },
    ],
  },
}

export default nextConfig
