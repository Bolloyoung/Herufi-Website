import Link from 'next/link'
import Logo from '@/components/Logo'

const footerLinks = {
  Research: [
    { label: 'Blogs', href: '/blogs' },
    { label: 'Publications', href: '/publications' },
    { label: 'Venture Strategy and Capital', href: '/blogs?pillar=venture-strategy' },
    { label: 'Markets, Systems and Economies', href: '/blogs?pillar=markets-systems' },
    { label: 'Data and Decision Intelligence', href: '/blogs?pillar=data-analytics' },
    { label: 'Culture and Context', href: '/blogs?pillar=culture-context' },
  ],
  Herufi: [
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
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5" aria-label="Herufi home">
              <Logo variant="light" />
            </Link>
            <p className="text-sm leading-relaxed text-cream/60 max-w-sm">
              Research and analytics for markets, ventures and systems, built for decision makers working across African markets.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href="mailto:hello@herufi.org" className="text-cream/60 hover:text-cream transition-colors">
                hello@herufi.org
              </a>
              <a
                href="https://linkedin.com/company/herufi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-cream text-sm font-semibold mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/60 hover:text-cream transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-cream/15">
          <p className="text-xs text-cream/50">
            &copy; {new Date().getFullYear()} Herufi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
