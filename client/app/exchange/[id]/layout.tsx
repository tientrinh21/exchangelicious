import {
  UniInfoName,
  UniInfoMeta,
  UniInfoContainer,
  UniInfoImgWrapper,
} from '@/components/uni-info'
import { InfoReviewsNav } from '@/components/info-reviews-nav'

interface ExchangeLayoutProps {
  children: React.ReactNode
}

export default function ExchangeLayout({ children }: ExchangeLayoutProps) {
  return (
    <div>
      <UniInfoImgWrapper imgSrc="/skku.jpeg">
        <UniInfoContainer>
          <UniInfoName name="Sungkuynkwan University" />
          <UniInfoMeta meta="Seoul, Suwon Campus" />
          <UniInfoMeta meta="Republic of Korea" />
          <UniInfoMeta meta="QS Ranking #171" />
        </UniInfoContainer>
      </UniInfoImgWrapper>

      <InfoReviewsNav />

      {children}
    </div>
  )
}
