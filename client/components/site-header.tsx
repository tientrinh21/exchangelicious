import Link from 'next/link'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { SiteLogo } from './site-logo'
import { Button } from './ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6 sm:px-8">
        <SiteLogo />

        <div className="flex items-center space-x-1 md:space-x-4">
          <MainNav />
          <MobileNav />
          <Link className="order-1" href="/sign-up">
            <Button className="rounded-lg text-base">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
