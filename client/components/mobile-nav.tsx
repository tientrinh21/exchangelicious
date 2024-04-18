"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" className="md:hidden">
          <HamburgerMenuIcon />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2 py-4 rounded-lg px-2 shadow-xl">
        <DropdownMenuItem>
          <NavLink href="/">
            Home
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink href="/exchange">
            Exchange
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink href="/my-page">
            My Page
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLink(props: { href: string, children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Link href={props.href} className={`w-full font-medium text-accent-foreground text-base text-center ${pathname === props.href ? 'opacity-100' : 'opacity-40'}`}>
      {props.children}
    </Link>
  )
}
