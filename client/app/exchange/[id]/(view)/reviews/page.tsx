import { InfoReviewsNav } from '@/components/info-reviews-nav'
import { ReviewSection } from '@/components/review'

export default function ReviewsPage({ params }: { params: { id: string } }) {
  return (
    <>
      <InfoReviewsNav uniId={params.id} />

      <ReviewSection uniId={params.id} />
    </>
  )
}
