'use client'

import {
  UniInfoContainer,
  UniInfoImgWrapper,
  UniInfoMeta,
  UniInfoName,
} from '@/components/uni-info'
import { usePathname } from 'next/navigation'

interface ExchangeLayoutProps {
  children: React.ReactNode
}

export default function ExchangeLayout({ children }: ExchangeLayoutProps) {
  // TODO: Depends on how we store images
  const uniName = usePathname()
    .replace('/edit', '')
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

      <div className="container flex max-w-screen-lg flex-col items-center gap-6 lg:items-baseline lg:gap-10">
        {children}
      </div>
    </div>
  )
}
