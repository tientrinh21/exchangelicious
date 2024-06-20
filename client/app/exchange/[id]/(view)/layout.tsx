import {
  UniHeaderContainer,
  UniHeaderImgWrapper,
  UniHeaderMeta,
  UniHeaderName,
} from '@/components/uni-header'
import { fetchUniversity } from '@/lib/request'
import type { University } from '@/types/university'

export default async function ExchangeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const data: University = await fetchUniversity(params.id)

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <UniHeaderImgWrapper universityId={data.university_id}>
        <UniHeaderContainer>
          <UniHeaderName name={data.long_name} />
          <UniHeaderMeta meta={data.campus ?? 'N/A'} />
          <UniHeaderMeta
            meta={`${data.region ?? 'N/A'} - ${data.country_name}`}
          />
          <UniHeaderMeta meta={`World Rank: ${data.ranking ?? 'N/A'}`} />
          <UniHeaderMeta meta={`Housing: ${data.housing}`} />
        </UniHeaderContainer>
      </UniHeaderImgWrapper>

      <div className="container flex w-full max-w-screen-lg flex-col items-center gap-6 lg:items-baseline lg:gap-10">
        {children}
      </div>
    </div>
  )
}
