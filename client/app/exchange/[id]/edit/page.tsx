'use client'

import data from '@/lib/seed.json'
import { usePathname } from 'next/navigation'

export default function InfoEditPage() {
  // TODO: To be change soon
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const uniData = data[uniName as keyof Object]
  return (
    <>
      <div>
        <span className="text-xl font-bold text-foreground md:text-2xl">
          Webpage
        </span>
      </div>
    </>
  )
}
