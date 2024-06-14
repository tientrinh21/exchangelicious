import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/auth'
import { deleteReview } from '@/lib/request'
import { cn } from '@/lib/utils'
import { Review } from '@/types/review-section'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { atomReloadReviews } from './review-section'

export function EditDeleteReview({ review }: { review: Review }) {
  const user = useUser()
  const setReloadReviews = useSetAtom(atomReloadReviews)

  async function handleDeleteReview({ review }: { review: Review }) {
    try {
      await deleteReview({ review_id: review.review_id })
      toast.success('Review deleted!')
      setReloadReviews(true)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div
      className={cn(
        'hidden',
        user && user!.user_id === review.user_id && 'flex',
      )}
    >
      <Button size="icon" className="hover:bg-primary/10" variant="ghost">
        <Pencil1Icon className="h-4 w-4 text-primary" />
        <span className="sr-only">Edit review</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-destructive/10"
        onClick={() => handleDeleteReview({ review })}
      >
        <TrashIcon className="h-4 w-4 text-destructive" />
        <span className="sr-only">Delete review</span>
      </Button>
    </div>
  )
}
