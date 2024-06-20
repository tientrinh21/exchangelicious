'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center md:flex">
      <Link
        href="/"
        className={`rounded-md px-4 py-2 font-medium hover:bg-secondary ${pathname === '/' ? 'text-accent-foreground' : 'text-accent-foreground/40'}`}
      >
        Home
      </Link>
      <Link
        href="/exchange"
        className={`rounded-md px-4 py-2 font-medium hover:bg-secondary ${pathname.includes('/exchange') ? 'text-accent-foreground' : 'text-accent-foreground/40'}`}
      >
        Exchange
      </Link>
      <Link
        href="/favorites"
        className={`rounded-md px-4 py-2 font-medium hover:bg-secondary ${pathname === '/favorites' ? 'text-accent-foreground' : 'text-accent-foreground/40'}`}
      >
        Favorites
      </Link>
    </nav>
  )
}
