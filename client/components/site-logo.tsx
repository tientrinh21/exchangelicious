import Link from 'next/link'

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 md:space-x-3">
      <img src="/logo.png" alt="logo" className="h-12 w-12 rounded-full" />
      <span className="inline-block text-lg font-extrabold text-foreground md:text-xl">
        Exchangelicious
      </span>
    </Link>
  )
}
