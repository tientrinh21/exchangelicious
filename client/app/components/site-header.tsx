import { MainNav } from "./main-nav"
import { SiteLogo } from "./site-logo"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between text-primary">
        <SiteLogo />
        <MainNav />
      </div>
    </header>
  )
}

