import { InfoReviewsNav } from '@/components/info-reviews-nav'

export default function ReviewsPage({ params }: { params: { id: string } }) {
  return (
    <>
      <InfoReviewsNav uniId={params.id} />

      <div className="">Hello from Reviews Page</div>
    </>
  )
}
