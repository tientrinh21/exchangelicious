'use client'

import { Skeleton } from '@/components/skeleton'
import {
  UniInfoContainer,
  UniInfoImgWrapper,
  UniInfoMeta,
  UniInfoName,
} from '@/components/uni-info'
import { fetcher } from '@/lib/utils'
import { University } from '@/types/university'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'

interface ExchangeLayoutProps {
  children: React.ReactNode
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

export default function ExchangeLayout({ children }: ExchangeLayoutProps) {
  // TODO: Depends on how we store images
  const uniName = usePathname()
    .replace('/edit', '')
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const { data, error, isLoading } = useSWR<University, Error>(
    `${BASE_URL}/universities/${uniName}`,
    fetcher,
  )

  if (isLoading)
    return (
      <div className="flex flex-col gap-4 md:gap-8">
        <div
          className="md:80 flex h-48 w-screen items-end justify-center bg-cover bg-center sm:h-72 lg:h-96"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
          }}
        >
          <UniInfoContainer>
            <Skeleton className="mb-2 h-10 w-[250px] bg-background sm:mb-3 md:mb-4 lg:mb-6" />
            <Skeleton className="mb-2 h-4 w-[150px] bg-background" />
            <Skeleton className="mb-2 h-4 w-[150px] bg-background" />
            <Skeleton className="mb-2 h-4 w-[150px] bg-background" />
          </UniInfoContainer>
        </div>

        <div className="container flex max-w-screen-lg flex-col items-center gap-6 lg:items-baseline lg:gap-10">
          {children}
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex h-[90vh] items-center justify-center">
        {children}
      </div>
    )

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <UniInfoImgWrapper imgSrc={`/${data!.university_id}.jpg`}>
        <UniInfoContainer>
          <UniInfoName name={data!.long_name} />
          <UniInfoMeta meta={`${data!.region} Campus`} />
          <UniInfoMeta meta={data!.country_name} />
          <UniInfoMeta meta={`QS Ranking #${data!.ranking}`} />
        </UniInfoContainer>
      </UniInfoImgWrapper>

      <div className="container flex max-w-screen-lg flex-col items-center gap-6 lg:items-baseline lg:gap-10">
        {children}
      </div>
    </div>
  )
}
