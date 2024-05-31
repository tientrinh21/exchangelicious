import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { SiteLogo } from './site-logo'
import { AccountButton } from './account-button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6 lg:px-8">
        <SiteLogo />

        <div className="flex items-center space-x-1 md:space-x-4">
          <MainNav />
          <MobileNav />
          <AccountButton />
        </div>
      </div>
    </header>
  )
}
