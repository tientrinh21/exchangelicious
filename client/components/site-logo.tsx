import Link from 'next/link'

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <img src="/logo.png" alt="EG" className="w-9 rounded-full"></img>
      <span className="inline-block text-lg font-extrabold text-foreground md:text-xl">
        ExchanGe
      </span>
    </Link>
  )
}
