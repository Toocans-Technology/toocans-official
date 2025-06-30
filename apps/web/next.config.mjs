/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    generateStatic: process.env.GENERATE_STATIC || 'false',
  },
  transpilePackages: ['@workspace/ui'],
  reactStrictMode: true,
  output: 'standalone',
}

export default nextConfig
