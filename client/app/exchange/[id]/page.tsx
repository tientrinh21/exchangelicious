'use client'

import { EditInfoButton } from '@/components/edit-button'
import { InfoReviewsNav } from '@/components/info-reviews-nav'
import {
  UniInfoContent,
  UniInfoError,
  UniInfoLoading,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
import { fetcher } from '@/lib/utils'
import type { Error } from '@/types/error'
import type { UniversityInfo } from '@/types/university'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'

// const BASE_URL = 'http://localhost:8080/api'
const BASE_URL = process.env.BASE_URL && 'http://localhost:8080/api'

export default function InfoPage() {
  // TODO: To be change soon
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const { data, error, isLoading } = useSWR<UniversityInfo, Error>(
    `${BASE_URL}/universities/${uniName}/info`,
    fetcher,
  )

  if (isLoading) return <UniInfoLoading />
  if (error) return <UniInfoError error={error} />

  return (
    <>
      <InfoReviewsNav />

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-14">
        <UniInfoNav data={data} />
        <UniInfoMobileMenu data={data} />
        <UniInfoContent data={data} />
        <EditInfoButton />
      </div>
    </>
  )
}
