/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      // Consolidated into /our-work (research article pages at /research/:slug remain)
      { source: '/research', destination: '/our-work', permanent: true },
      { source: '/analytics', destination: '/our-work#analytics', permanent: true },
      { source: '/frameworks', destination: '/our-work', permanent: true },
      { source: '/frameworks/:path*', destination: '/our-work', permanent: true },
      { source: '/data-lab', destination: '/our-work#analytics', permanent: true },
      { source: '/reports', destination: '/our-work#reports', permanent: true },
      { source: '/projects', destination: '/our-work', permanent: true },
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
