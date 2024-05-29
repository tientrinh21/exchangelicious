'use client'

import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function EditInfoButton() {
  const uniPathname = usePathname().replace('/reviews', '')

  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-5 h-9 w-9 rounded-2xl sm:right-8 md:h-10 md:w-10"
    >
      <Link href={`${uniPathname}/edit`}>
        <Pencil1Icon />
        <span className="sr-only">Edit University's Information</span>
      </Link>
    </Button>
  )
}

export { EditInfoButton }
