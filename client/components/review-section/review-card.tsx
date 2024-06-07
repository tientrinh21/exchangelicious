import { Review } from '@/types/review-section'
import { ThickArrowUpIcon, ThickArrowDownIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border px-5 py-3 shadow">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={`https://avatar.iran.liara.run/public/${Math.random() * 98 + 1}`}
            alt="author"
          />
          <AvatarFallback>{review.user_id.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="truncate font-medium">{review.user_id}</span>
      </div>

      <span className="font-medium text-secondary-foreground">
        {review.content}
      </span>

      <div className="flex gap-1">
        <Button variant="outline" size="icon" className="w-11">
          <ThickArrowUpIcon
            className={cn('h-4 w-4', review.has_upvoted && 'text-primary')}
          />{' '}
          {review.upvotes}
        </Button>
        <Button variant="outline" size="icon" className="w-11">
          <ThickArrowDownIcon
            className={cn('h-4 w-4', review.has_downvoted && 'text-primary')}
          />{' '}
          {review.downvotes}
        </Button>
      </div>
    </div>
  )
}
