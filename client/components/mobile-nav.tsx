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
  const pathname = usePathname()

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
          <Link href="/" className={`w-full font-medium text-accent-foreground text-base text-center ${pathname === '/' ? 'opacity-100' : 'opacity-40'}`}>
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/exchange" className={`w-full font-medium text-accent-foreground text-base text-center ${pathname.includes("/exchange") ? 'opacity-100' : 'opacity-40'}`}>
            Exchange
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/my-page" className={`w-full font-medium text-accent-foreground text-base text-center ${pathname === '/my-page' ? 'opacity-100' : 'opacity-40'}`}>
            My Page
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
