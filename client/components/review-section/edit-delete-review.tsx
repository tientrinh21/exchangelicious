import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Review } from '@/types/review-section'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

export function EditDeleteReview({ review }: { review: Review }) {
  const user = useUser()

  function handleDeleteReview() {
    throw new Error('Function not implemented.')
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
        onClick={handleDeleteReview}
      >
        <TrashIcon className="h-4 w-4 text-destructive" />
        <span className="sr-only">Delete review</span>
      </Button>
    </div>
  )
}
