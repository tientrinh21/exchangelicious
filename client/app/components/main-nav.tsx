"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center gap-4 md:gap-6">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/exchange">Exchange</NavLink>
      <NavLink href="/my-page">My Page</NavLink>
    </nav>
  )
}

function NavLink(props: { href: string, children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Link href={props.href} className={`font-medium text-accent-foreground ${pathname === props.href ? 'opacity-100' : 'opacity-40'}`}>
      {props.children}
    </Link>
  )
}
