"use client"

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
  const imgName = usePathname().replace("/reviews", "").replace("/exchange/", "")

  return (
    <div className='flex flex-col gap-4 md:gap-8'>
      <UniInfoImgWrapper imgSrc={`/${imgName}.jpg`}>
        <UniInfoContainer>
          <UniInfoName name="Sungkyunkwan University" />
          <UniInfoMeta meta="Seoul, Suwon Campus" />
          <UniInfoMeta meta="Republic of Korea" />
          <UniInfoMeta meta="QS Ranking #171" />
        </UniInfoContainer>
      </UniInfoImgWrapper>

      <div className='container max-w-screen-lg flex flex-col gap-6 md:gap-8 items-center lg:items-baseline'>
        <InfoReviewsNav />

        {children}
      </div>
    </div>
  )
}
