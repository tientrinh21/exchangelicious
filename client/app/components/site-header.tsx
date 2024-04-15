import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { SiteLogo } from "./site-logo"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between text-primary">
        <SiteLogo />

        <div className="flex space-x-1 md:space-x-3 items-center">
          <MainNav />
          <button className="bg-blue-500 h-8 px-3 text-background font-medium rounded-lg">Sign Up</button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

