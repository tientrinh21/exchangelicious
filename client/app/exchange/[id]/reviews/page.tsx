'use client'

import CommentSectionDemo from '@/components/comment-section-demo'
import { InfoReviewsNav } from '@/components/info-reviews-nav'
import { useSearchParams } from 'next/navigation'

export default function ReviewsPage({ params }: { params: { id: string } }) {
  return (
    <>
      <InfoReviewsNav />

      <div className="">Hello from Reviews Page</div>
      <CommentSectionDemo university_id={params.id} />
    </>
  )
}
