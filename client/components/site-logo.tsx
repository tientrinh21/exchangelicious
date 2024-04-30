import Link from "next/link"

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <img src="https://github.com/shadcn.png" alt="eduventure" className="w-8 rounded-full"></img>
      <span className="font-extrabold inline-block text-foreground text-lg md:text-xl">Eduventure</span>
    </Link>
  )
}
