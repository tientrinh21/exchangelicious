'use client'

import { ArrowUpCircleIcon, ArrowUpCircleSolidIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getUserData } from '@/lib/auth'
import { upvote } from '@/lib/request'
import { Review } from '@/types/review-section'
import { useState } from 'react'

export function UpvoteButton({ review }: { review: Review }) {
  const [hasUpvoted, setHasUpvoted] = useState(review.has_upvoted)
  const [upvotes, setUpvotes] = useState(review.upvotes)

  const handleUpvote = async () => {
    try {
      const res = await upvote({ user_id: getUserData().user_id, review })

      review.has_upvoted = !review.has_upvoted
      setHasUpvoted(review.has_upvoted)

      review.upvotes = review.has_upvoted
        ? review.upvotes + 1
        : review.upvotes - 1
      setUpvotes(review.upvotes)
      console.log(review.upvotes)
      return res
    } catch (error: any) {
      console.log(error)
    }
  }
  return (
    <Button
      variant="outline"
      size="icon"
      className="w-12"
      onClick={handleUpvote}
    >
      {hasUpvoted ? (
        <ArrowUpCircleSolidIcon className="mr-px size-5 text-primary" />
      ) : (
        <ArrowUpCircleIcon className="mr-px size-5" />
      )}
      <span className="mt-0.5">{upvotes}</span>
    </Button>
  )
}
