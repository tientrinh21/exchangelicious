"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-4 md:gap-6">
      <Link href="/" className={`font-medium text-accent-foreground ${pathname === "/" ? 'opacity-100' : 'opacity-40'}`}>
        Home
      </Link>
      <Link href="/exchange" className={`font-medium text-accent-foreground ${pathname.includes("/exchange") ? 'opacity-100' : 'opacity-40'}`}>
        Exchange
      </Link>
      <Link href="/my-page" className={`font-medium text-accent-foreground ${pathname === "/my-page" ? 'opacity-100' : 'opacity-40'}`}>
        My Page
      </Link>
    </nav>
  )
}
