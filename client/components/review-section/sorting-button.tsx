'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  TextAlignBottomIcon,
} from '@radix-ui/react-icons'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import { atomReloadReviews, atomSortOption } from './review-section'

const sortOptions = ['default', 'new', 'old']

function SortingIcons({
  option,
  className,
}: {
  option: string
  className?: string
}) {
  if (option === 'new') return <ArrowUpIcon className={cn('mr-1', className)} />
  else if (option === 'old')
    return <ArrowDownIcon className={cn('mb-0.5 mr-1', className)} />
  else return <TextAlignBottomIcon className={cn('mb-1 mr-1.5', className)} />
}

export function SortingButton() {
  const [sortOpen, setSortOpen] = useState(false)
  const [sortOption, setSortOption] = useAtom(atomSortOption)
  const setReloadRevews = useSetAtom(atomReloadReviews)

  return (
    <Popover open={sortOpen} onOpenChange={setSortOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="flex h-8 w-fit min-w-20 justify-between self-end text-sm capitalize text-muted-foreground hover:text-muted-foreground"
        >
          <SortingIcons option={sortOption} />
          {sortOption}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[200] w-32 p-0">
        <Command>
          <CommandGroup>
            <CommandList>
              {sortOptions.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    setSortOption(opt)
                    setSortOpen(false)
                    setReloadRevews(true)
                  }}
                  className="capitalize"
                >
                  {opt}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      sortOption == opt ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
