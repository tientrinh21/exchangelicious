'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import Link from 'next/link'

function EditInfoButton({ uniId }: { uniId: string }) {
  const isAuth = useAuth()

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
