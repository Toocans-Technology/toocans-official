/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '.',
  env: {
    generateStatic: process.env.GENERATE_STATIC || 'false',
  },
  transpilePackages: ['@workspace/ui'],
}

export default nextConfig
