'use client'

import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function EditInfoButton() {
  // TODO: depends on university_id
  const uniPathname = usePathname().replace('/reviews', '')

  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 h-8 w-8 rounded-lg md:h-10 md:w-10"
    >
      <Link href={`${uniPathname}/edit`}>
        <Pencil1Icon />
        <span className="sr-only">Edit University's Information</span>
      </Link>
    </Button>
  )
}

export { EditInfoButton }
