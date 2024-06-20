'use client'

import {
  ArrowDownCircleIcon,
  ArrowDownCircleSolidIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getUserData } from '@/lib/auth'
import { downvote } from '@/lib/request'
import { Review } from '@/types/review'
import { useAtom } from 'jotai'
import { toast } from 'sonner'
import {
  atomDownvotes,
  atomHasDownvoted,
  atomHasUpvoted,
  atomUpvotes,
} from './review-card'

export function DownvoteButton({ review }: { review: Review }) {
  const [hasUpvoted, setHasUpvoted] = useAtom(atomHasUpvoted)
  const [_, setUpvotes] = useAtom(atomUpvotes)

  const [hasDownvoted, setHasDownVoted] = useAtom(atomHasDownvoted)
  const [downvotes, setDownvotes] = useAtom(atomDownvotes)

  const handleDownvote = async () => {
    try {
      await downvote({ user_id: getUserData().user_id, review })

      review.has_downvoted = !review.has_downvoted
      setHasDownVoted(review.has_downvoted)

      if (review.has_downvoted) {
        review.downvotes++

        if (hasUpvoted) {
          review.has_upvoted = false
          setHasUpvoted(false)

          review.upvotes--
          setUpvotes(review.upvotes)
        }
      } else review.downvotes--
      setDownvotes(review.downvotes)
    } catch (error: any) {
      // Not logged in user pressed downvote
      if (String(error).includes('Unexpected end of JSON input'))
        toast.error('You need to log in first')
      else console.error(error)
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
