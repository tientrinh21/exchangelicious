'use client'

import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function EditInfoButton({ uniId }: { uniId: string }) {
  // TODO: Fix cannot use useAuth because its parent is RSC
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [typeof window !== 'undefined'])

  return (
    <Link
      href={`${uniId}/edit`}
      className="fixed bottom-8 right-5 z-10 sm:bottom-10 sm:right-6 md:right-8 "
    >
      <Button
        size="icon"
        className={cn('h-9 w-9 md:h-10 md:w-10', !isAuth && 'hidden')}
      >
        <Pencil1Icon />
        <span className="sr-only">Edit University's Information</span>
      </Button>
    </Link>
  )
}

export { EditInfoButton }
