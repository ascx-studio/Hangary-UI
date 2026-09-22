import Link from 'next/link'
import { navLinks } from '@/data/Navlinks'

export default function Navbar() {
  return (
    <nav className="border-b border-white/10  p-4">
      <div className="mx-auto flex  max-w-7xl items-center justify-between px-6 md:px-10">
        <Link className="text-xl font-semibold tracking-tight" href="/">
          UI Lib
        </Link>
        <ul className="flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                aria-label={link.icon === 'github' ? 'GitHub' : undefined}
                className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-white/10 hover:text-white"
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.icon === 'github' ? (
                  <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17a4.6 4.6 0 0 1 1.24 3.22c0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                  </svg>
                ) : (
                  link.label
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
