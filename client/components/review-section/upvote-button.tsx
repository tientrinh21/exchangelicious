'use client'

import { ArrowUpCircleIcon, ArrowUpCircleSolidIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getUserData } from '@/lib/auth'
import { upvote } from '@/lib/request'
import { Review } from '@/types/review'
import { useAtom } from 'jotai'
import { toast } from 'sonner'
import {
  atomDownvotes,
  atomHasDownvoted,
  atomHasUpvoted,
  atomUpvotes,
} from './review-card'

export function UpvoteButton({ review }: { review: Review }) {
  const [hasUpvoted, setHasUpvoted] = useAtom(atomHasUpvoted)
  const [upvotes, setUpvotes] = useAtom(atomUpvotes)

  const [hasDownvoted, setHasDownVoted] = useAtom(atomHasDownvoted)
  const [_, setDownvotes] = useAtom(atomDownvotes)

  const handleUpvote = async () => {
    try {
      await upvote({ user_id: getUserData().user_id, review })

      review.has_upvoted = !review.has_upvoted
      setHasUpvoted(review.has_upvoted)

      if (review.has_upvoted) {
        review.upvotes++

        if (hasDownvoted) {
          review.has_downvoted = false
          setHasDownVoted(false)

          review.downvotes--
          setDownvotes(review.downvotes)
        }
      } else review.upvotes--
      setUpvotes(review.upvotes)
    } catch (error: any) {
      // Not logged in user pressed upvote
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
