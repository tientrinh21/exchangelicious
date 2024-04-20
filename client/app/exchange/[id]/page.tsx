'use client'

import {
  UniInfoContent,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
import data from '@/lib/seed.json'
import { toRomanNumerals } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function InfoPage() {
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const uniData = data[uniName as keyof Object]

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-14">
      <UniInfoNav data={uniData} />
      <UniInfoMobileMenu data={uniData} />
      <UniInfoContent data={uniData} />
    </div>
  )
}
