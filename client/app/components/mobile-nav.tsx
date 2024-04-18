import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export function MobileNav() {
  return (
    <button className="inline-flex items-center justify-center md:hidden bg-foreground text-background w-8 h-8 rounded-lg">
      <HamburgerMenuIcon />
    </button>
  )
}
