/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'ipfs.io',
      'gateway.pinata.cloud',
      'files.cdn.printful.com'
    ]
  }
}

module.exports = nextConfig
