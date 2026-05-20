/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      { source: '/frameworks', destination: '/analytics', permanent: true },
      { source: '/frameworks/:path*', destination: '/analytics', permanent: true },
      { source: '/data-lab', destination: '/analytics#tools', permanent: false },
      { source: '/reports', destination: '/research#reports', permanent: false },
      { source: '/projects', destination: '/research', permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
