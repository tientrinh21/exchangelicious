import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { SiteLogo } from "./site-logo"
import { Button } from "./ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container px-6 sm:px-8 flex h-16 max-w-screen-xl items-center justify-between">
        <SiteLogo />

        <div className="flex space-x-1 md:space-x-6 items-center">
          <MainNav />
          <Button className="rounded-lg text-base">Sign up</Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

