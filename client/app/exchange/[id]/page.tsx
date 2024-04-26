'use client'

import { InfoReviewsNav } from '@/components/info-reviews-nav'
import {
  UniInfoContent,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
import data from '@/lib/seed.json'
import { usePathname } from 'next/navigation'
import { EditInfoButton } from '@/components/edit-button'
import useSWR, { Fetcher } from 'swr'

const BASE_URL = 'http://127.0.0.1:8080/api'
const fetcher = (pathname: string) =>
  fetch(`${BASE_URL}${pathname}`).then((res) => res.json())

export default function InfoPage() {
  // TODO: To be change soon
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const uniData = data[uniName as keyof Object]

  return (
    <>
      <InfoReviewsNav />

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-14">
        <UniInfoNav data={uniData} />
        <UniInfoMobileMenu data={uniData} />
        <UniInfoContent data={uniData} />
        <EditInfoButton />
      </div>
    </>
  )
}
