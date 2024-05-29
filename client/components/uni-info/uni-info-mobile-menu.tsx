'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { objKeyToText, toRomanNumerals } from '@/lib/utils'
import type { UniversityInfo } from '@/types/university'
import { ArrowUpIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useState } from 'react'

export default function UniInfoMobileMenu(props: {
  data: UniversityInfo | undefined
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="sticky top-20 mx-auto flex w-1/3 justify-center rounded-lg bg-background lg:hidden">
          <Button
            variant="outline"
            className="w-full bg-muted-foreground/15 text-foreground/65"
          >
            <DotsHorizontalIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="sr-only">Dots Menu</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[65vw] space-y-2 rounded-lg px-4 py-4 shadow-xl sm:w-[40vw]"
      >
        {Object.entries(props.data!).map(([key, _], index) => {
          if (key === 'webpage') return
          return (
            <DropdownMenuItem key={index} onClick={() => setOpen(false)}>
              <Link
                href={`#${key}`}
                className={`mx-auto w-2/3 text-base font-medium text-accent-foreground`}
              >
                <span className="mr-1 inline-block w-8">{`${toRomanNumerals(index)}.`}</span>
                <span>{objKeyToText(key)}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuItem>
          <Link
            href=""
            className={`mx-auto w-2/3 text-base font-medium text-accent-foreground`}
          >
            <ArrowUpIcon className="mr-4 inline-block h-5 w-5" />
            <span>Back to top</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
