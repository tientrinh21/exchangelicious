import Link from 'next/link'

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center sm:space-x-2 md:space-x-3">
      <img
        src="/logo.png"
        alt="logo"
        className="h-9 w-9 rounded-full sm:h-12 sm:w-12"
      />
      <span className="inline-block text-base font-extrabold text-foreground sm:text-lg md:text-xl">
        Exchangelicious
      </span>
    </Link>
  )
}
