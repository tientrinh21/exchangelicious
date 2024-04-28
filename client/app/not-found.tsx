import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold text-destructive">404: Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="mt-5">
        <Button variant="secondary">Return Home</Button>
      </Link>
    </div>
  )
}
