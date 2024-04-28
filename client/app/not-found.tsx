import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='text-center h-screen flex flex-col items-center justify-center'>
      <h2 className='text-destructive font-bold text-xl'>404: Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className='mt-5'>
        <Button variant="secondary">Return Home</Button>
      </Link>
    </div>
  )
}
