import { ArrowDownCircleIcon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { displayMood, hashIDToNumber } from '@/lib/utils'
import { Review } from '@/types/review-section'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { UpvoteButton } from './upvote-button'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border px-5 py-3 shadow">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${hashIDToNumber(review.user_id)}`}
              className="h-9 w-9"
              alt="author"
            />
            <AvatarFallback>{review.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="truncate font-semibold text-secondary-foreground">
            {review.username}
          </span>
        </div>
        <span className="flex items-center font-mono">
          {displayMood(review.mood_score)}
        </span>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-bold text-foreground md:text-xl-plus">
          {review.title}
        </h2>
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="prose max-w-none font-medium text-secondary-foreground prose-h1:mb-1 prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base"
          components={{
            a: ({ node, href, ...props }) => (
              <Link
                {...props}
                href={href as Url}
                target="_blank"
                className="break-words text-primary underline underline-offset-4 hover:text-primary/80"
              />
            ),
          }}
        >
          {review.content}
        </Markdown>
      </div>

      <div className="flex gap-1">
        <UpvoteButton review={review} />
        <Button variant="outline" size="icon" className="w-12">
          {review.has_downvoted ? (
            <ArrowDownCircleIcon className="mr-px size-5 text-primary" />
          ) : (
            <ArrowDownCircleIcon className="mr-px size-5" />
          )}
          <span className="mt-0.5">{review.downvotes}</span>
        </Button>
      </div>
    </div>
  )
}
