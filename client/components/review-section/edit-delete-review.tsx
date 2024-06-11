import { Button } from '@/components/ui/button'
import { getUserData, isAuthenticated } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Review } from '@/types/review-section'
import type { User } from '@/types/user'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

export function EditDeleteReview({ review }: { review: Review }) {
  // TODO: Fix cannot use useAuth because its parent is RSC
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true)
      const user = getUserData()
      setUser(user)
    }
  }, [typeof window !== 'undefined'])

  return (
    <div
      className={cn(
        'hidden',
        isAuth && user?.user_id === review.user_id && 'flex',
      )}
    >
      <Button size="icon" variant="ghost">
        <Pencil1Icon className="h-4 w-4 text-primary" />
        <span className="sr-only">Edit review</span>
      </Button>
      <Button size="icon" variant="ghost">
        <TrashIcon className="h-4 w-4 text-destructive" />
        <span className="sr-only">Delete review</span>
      </Button>
    </div>
  )
}
