import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export function MobileNav() {
  return (
    <Button size="icon" variant="secondary" className="md:hidden">
      <HamburgerMenuIcon />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )
}
