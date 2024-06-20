import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
  return (
    <>
      <Separator />
      <footer className="w-full px-2 py-7 text-center text-sm text-accent-foreground">
        <span>Exchangelicious - &copy;{new Date().getFullYear()}</span>
      </footer>
    </>
  )
}
