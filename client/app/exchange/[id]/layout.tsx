'use client'

import {
  UniInfoName,
  UniInfoMeta,
  UniInfoContainer,
  UniInfoImgWrapper,
} from '@/components/uni-info'
import { InfoReviewsNav } from '@/components/info-reviews-nav'
import { usePathname } from 'next/navigation'

interface ExchangeLayoutProps {
  children: React.ReactNode
}

export default function ExchangeLayout({ children }: ExchangeLayoutProps) {
  // TODO: Depends on how we store images
  const uniName = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <UniInfoImgWrapper imgSrc={`/${uniName}.jpg`}>
        <UniInfoContainer>
          <UniInfoName name="Sungkyunkwan University" />
          <UniInfoMeta meta="Seoul, Suwon Campus" />
          <UniInfoMeta meta="Republic of Korea" />
          <UniInfoMeta meta="QS Ranking #171" />
        </UniInfoContainer>
      </UniInfoImgWrapper>

      <div className="container flex max-w-screen-lg flex-col items-center gap-8 md:gap-10 lg:items-baseline">
        <InfoReviewsNav />

        {children}
      </div>
    </div>
  )
}
