"use client"

import Link from "next/link"
// import { usePathname } from "next/navigation"

export function MainNav() {
  // const pathname = usePathname()

  return (
    <nav className="flex items-center gap-4 lg:gap-6">
      <Link href="/">Home</Link>
      <Link href="/exchange">Exchange</Link>
      <Link href="/my-page">My Page</Link>
    </nav>
  )
}
