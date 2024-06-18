'use client'

import React from 'react'
import Link from 'next/link'
import type { Favorite } from '@/types/favorite'
import { TrashIcon } from '@radix-ui/react-icons'
import { useUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { atom, useSetAtom } from 'jotai'
import { removeFavorite } from '@/lib/request'

export const atomReloadFavorites = atom(false)

export function FavoriteCard(props: { favorite: Favorite }) {
  const user = useUser()
  const setReloadFavorites = useSetAtom(atomReloadFavorites)

  const handleRemoveFavorite = async (event: any) => {
    event.preventDefault()
    const toastId = toast.loading('Adding university to Favorites...')

    try {
      await removeFavorite({ favorite_id: props.favorite.favorite_id })
      toast.success('Successfully added to Favorites.', { id: toastId })
      setReloadFavorites(true)
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)
      toast.error('Something went wrong!', { id: toastId })
    }
  }

  return (
    <Link href={`/exchange/${props.favorite.university_id}`} className="z-0">
      <div className="group mx-auto flex max-w-full cursor-pointer flex-col items-start justify-between rounded-lg border-2 border-gray-100 bg-white px-8 py-4 shadow transition-colors duration-150 hover:bg-gray-100 lg:flex-row lg:items-center">
        {/* Combined Section for Mobile, split into Left and Right for Desktop */}
        <div className="flex flex-grow flex-col gap-1 sm:text-left">
          <div className="flex items-center gap-3">
            <h2 className="text-xl-plus font-bold text-secondary-foreground lg:text-2xl">
              {props.favorite.long_name}
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
            <span>{props.favorite.campus ?? 'N/A'}</span>
            <span className="mx-1.5 hidden sm:inline">|</span>
            <span>
              {props.favorite.region ?? 'N/A'}
              {' - '}
              {props.favorite.country_name}
            </span>
          </p>
        </div>

        <div className="flex flex-col pl-0 text-left sm:w-full lg:w-fit lg:min-w-[205px] lg:flex-col lg:pl-4 lg:text-right">
          <p className="font-medium text-muted">
            QS Ranking: {props.favorite.ranking ?? 'N/A'}
          </p>
          <p className="font-medium text-muted">
            Housing: {props.favorite.housing}
          </p>
        </div>
      </div>
    </Link>
  )
}
