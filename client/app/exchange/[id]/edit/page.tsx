import {
  UniHeaderContainer,
  UniHeaderImgWrapper,
  UniHeaderMeta,
  UniHeaderName,
} from '@/components/uni-header'
import { fetchUniversity, fetchUniversityInfo } from '@/lib/request'
import type { University, UniversityInfo } from '@/types/university'

export default async function InfoEditPage({
  params,
}: {
  params: { id: string }
}) {
  const uniData: University = await fetchUniversity(params.id)
  const infoData: UniversityInfo = await fetchUniversityInfo(params.id)

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <UniHeaderImgWrapper imgSrc={`/${uniData.university_id}.jpg`}>
        <UniHeaderContainer>
          <UniHeaderName name={uniData.long_name} />
          <UniHeaderMeta meta={`${uniData.region}`} />
          <UniHeaderMeta meta={uniData.country_name} />
          <UniHeaderMeta meta={`QS Ranking #${uniData.ranking}`} />
        </UniHeaderContainer>
      </UniHeaderImgWrapper>

      <div className="container flex max-w-screen-lg flex-col items-center gap-6 lg:items-baseline lg:gap-10">
        Testing
      </div>
    </div>
  )
}
