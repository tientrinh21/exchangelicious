'use client'

import {
  ArrowDownCircleIcon,
  ArrowDownCircleSolidIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getUserData } from '@/lib/auth'
import { downvote } from '@/lib/request'
import { Review } from '@/types/review-section'
import { useState } from 'react'
import { toast } from 'sonner'

export function DownvoteButton({ review }: { review: Review }) {
  const [hasDownvoted, setHasDownVoted] = useState(review.has_downvoted)
  const [downvotes, setDownvotes] = useState(review.downvotes)

  const handleDownvote = async () => {
    try {
      await downvote({ user_id: getUserData().user_id, review })

      review.has_downvoted = !review.has_downvoted
      setHasDownVoted(review.has_downvoted)

      review.has_downvoted ? review.downvotes++ : review.downvotes--
      setDownvotes(review.downvotes)
    } catch (error: any) {
      // Not logged in user pressed downvote
      if (String(error).includes('Unexpected end of JSON input'))
        toast.error('You need to log in first')
      else console.log(error)
    }
  }
  return (
    <Button
      variant="outline"
      size="icon"
      className="w-12"
      onClick={handleDownvote}
    >
      {hasDownvoted ? (
        <ArrowDownCircleSolidIcon className="mr-px size-5 text-primary" />
      ) : (
        <ArrowDownCircleIcon className="mr-px size-5" />
      )}
      <span className="mt-0.5">{downvotes}</span>
    </Button>
  )
}
