import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { SiteLogo } from "./site-logo"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between text-foreground">
        <SiteLogo />

        <div className="flex space-x-1 md:space-x-6 items-center">
          <MainNav />
          <button className="h-8 px-3 text-primary-foreground bg-primary font-medium rounded-lg">Sign Up</button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

