import Link from 'next/link'
import Logo from '@/components/Logo'

const footerLinks = {
  Explore: [
    { label: 'Blogs', href: '/blogs' },
    { label: 'Publications', href: '/publications' },
    { label: 'Venture Strategy', href: '/blogs?pillar=venture-strategy' },
    { label: 'Markets and Economies', href: '/blogs?pillar=markets-systems' },
    { label: 'Climate and Energy', href: '/blogs?pillar=climate-energy' },
    { label: 'Data and Analytics', href: '/blogs?pillar=data-analytics' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Member Sign In', href: '/login' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/70">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-4">
              <Logo variant="light" />
            </Link>
            <p className="text-sm leading-relaxed text-cream/50 max-w-xs mb-6">
              Research and analytics for markets, ventures and systems.
              Built for decision makers working across African markets.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/company/herufi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/40 hover:text-gold transition-colors text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:hello@herufi.org"
                className="text-cream/40 hover:text-gold transition-colors text-sm"
              >
                hello@herufi.org
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-cream text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/50 hover:text-cream transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} Herufi. All rights reserved.
          </p>
          <p className="text-xs text-cream/30">
            herufi.org | Research and Analytics
          </p>
        </div>
      </div>
    </footer>
  )
}
