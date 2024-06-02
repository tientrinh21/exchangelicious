import { EditInfoButton } from '@/components/edit-button'
import { InfoReviewsNav } from '@/components/info-reviews-nav'
import {
  UniInfoContent,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
import { fetchUniversityInfo } from '@/lib/request'
import type { UniversityInfo } from '@/types/university'

export default async function InfoPage({ params }: { params: { id: string } }) {
  const data: UniversityInfo = await fetchUniversityInfo(params.id)

  return (
    <>
      <InfoReviewsNav uniId={params.id} />

      <div className="flex w-full flex-col justify-between gap-3 lg:flex-row lg:gap-14">
        <UniInfoNav data={data} />
        <UniInfoMobileMenu data={data} />
        <UniInfoContent data={data} />
        <EditInfoButton uniId={params.id} />
      </div>
    </>
  )
}
