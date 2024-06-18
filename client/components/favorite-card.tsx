'use client'

import React from 'react'
import Link from 'next/link'
import type { University } from '@/types/university'
import { getCountryName } from '@/lib/utils'
import { TrashIcon } from '@radix-ui/react-icons'
import { useUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function FavoriteCard(props: { university: University }) {
  const user = useUser()

  const handleRemoveFavorite = async (event: any) => {
    event.preventDefault()
    const toastId = toast.loading('Adding university to Favorites...')

    try {
      // TODO: await
      toast.success('Successfully added to Favorites.', { id: toastId })
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg.includes('Duplicate entry'))
        toastMsg = 'This university has already been added.'

      toast.error(toastMsg, { id: toastId })
    }
  }

  return (
    <Link href={`/exchange/${props.university.university_id}`} className="z-0">
      <div className="group mx-auto flex max-w-full cursor-pointer flex-col items-start justify-between rounded-lg border-2 border-gray-100 bg-white px-8 py-4 shadow transition-colors duration-150 hover:bg-gray-100 lg:flex-row lg:items-center">
        {/* Combined Section for Mobile, split into Left and Right for Desktop */}
        <div className="flex flex-grow flex-col gap-1 sm:text-left">
          <div className="flex items-center gap-3">
            <h2 className="text-xl-plus font-bold text-secondary-foreground lg:text-2xl">
              {props.university.long_name}
            </h2>

            {!!user && (
              <Button
                size="icon"
                variant="ghost"
                className="hidden h-8 w-8 hover:bg-destructive/20 group-hover:flex"
                onClick={handleRemoveFavorite}
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          <p className="flex flex-col font-medium text-muted sm:flex-row">
            <span>{props.university.campus ?? 'N/A'}</span>
            <span className="mx-1.5 hidden sm:inline">|</span>
            <span>
              {props.university.region ?? 'N/A'} -{' '}
              {getCountryName(props.university.country_code)}
            </span>
          </p>
        </div>

        <div className="flex flex-col pl-0 text-left sm:w-full lg:w-fit lg:min-w-[205px] lg:flex-col lg:pl-4 lg:text-right">
          <p className="font-medium text-muted">
            QS Ranking: {props.university.ranking ?? 'N/A'}
          </p>
          <p className="font-medium text-muted">
            Housing: {props.university.housing}
          </p>
        </div>
      </div>
    </Link>
  )
}
