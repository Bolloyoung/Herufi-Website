/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      // Blogs and Publications replaced Our Work and the old research routes
      { source: '/our-work', destination: '/blogs', permanent: true },
      { source: '/research', destination: '/blogs', permanent: true },
      { source: '/research/:slug', destination: '/blogs/:slug', permanent: true },
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/analytics', destination: '/blogs', permanent: true },
      { source: '/frameworks', destination: '/blogs', permanent: true },
      { source: '/frameworks/:path*', destination: '/blogs', permanent: true },
      { source: '/data-lab', destination: '/blogs', permanent: true },
      { source: '/reports', destination: '/publications', permanent: true },
      { source: '/projects', destination: '/blogs', permanent: true },
      // Consolidated into /about
      { source: '/services', destination: '/about', permanent: true },
      { source: '/platform', destination: '/about', permanent: true },
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
