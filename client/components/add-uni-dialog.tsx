'use client'

import { Button } from './ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function AddUniDialog() {
  const isAuth = useAuth()

  return (
    <Button
      size="icon"
      className={cn(
        'fixed bottom-8 right-5 h-9 w-9 rounded-2xl sm:right-8 md:h-10 md:w-10',
        !isAuth && 'hidden',
      )}
    >
      <PlusIcon />
      <span className="sr-only">Add New University</span>
    </Button>
  )
}
