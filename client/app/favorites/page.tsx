'use client'

import { FavoriteCard, atomReloadFavorites } from '@/components/favorite-card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { getUserData, isAuthenticated, useAuth } from '@/lib/auth'
import { Favorite } from '@/types/favorite'
import axios from 'axios'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'sonner'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(2)

  const [reloadFavorites, setReloadFavorites] = useAtom(atomReloadFavorites)

  const isAuth = useAuth()

  // fetch initial data
  useEffect(() => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/favorites`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page_number: 1,
        user_id: isAuthenticated() ? getUserData().user_id : '',
      },
    })
      .then((res) => {
        setHasMore(res.data['hasMore'])
        setFavorites(res.data['items'])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })

    setPageNumber(2)
    setReloadFavorites(false)
  }, [typeof window !== 'undefined', reloadFavorites])

  const fetchMoreData = () => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/favorites`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page_number: pageNumber,
        user_id: isAuthenticated() ? getUserData().user_id : '',
      },
    })
      .then((res) => {
        setHasMore(res.data['hasMore'])
        setFavorites((previousUniversities) => [
          ...previousUniversities,
          ...res.data['items'],
        ])
        setPageNumber((prevIndex) => prevIndex + 1)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  return (
    <>
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-8">
        <div className="py-5 text-center md:py-8">
          <h1 className="text-xl-plus font-bold text-secondary-foreground">
            Your <span className="text-primary">personal space</span> to keep
            univerties you would like to do exchange
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between lg:flex-row">
          <div className="flex w-full flex-col">
            <div className="search-content mt-0 text-secondary-foreground">
              {!isAuth && (
                <div className="my-10 flex w-full flex-col items-center justify-center text-center md:top-2/3">
                  <h2 className="text-xl font-bold text-destructive">
                    You need to login first
                  </h2>
                  <div className="flex gap-1">
                    <Link href="/sign-in" className="mt-5">
                      <Button>Sign in</Button>
                    </Link>
                    <Link href="/sign-up" className="mt-5">
                      <Button variant="secondary">Sign up</Button>
                    </Link>
                  </div>
                </div>
              )}
              {isAuth && isLoading && (
                <LoadingSpinner className="my-10" text="Loading..." />
              )}
              {isAuth && !isLoading && favorites.length == 0 && (
                <p className="my-10 text-center text-lg font-semibold text-secondary-foreground">
                  No matching results found.
                </p>
              )}

              {isAuth && favorites.length > 0 && (
                <InfiniteScroll
                  dataLength={favorites.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <LoadingSpinner className="my-10" text="Loading..." />
                  }
                  endMessage={
                    <p className="my-10 text-center text-lg font-semibold text-secondary-foreground">
                      No more results found.
                    </p>
                  }
                >
                  <div className="flex flex-col gap-4">
                    {favorites.map((favorite) => (
                      <FavoriteCard
                        key={favorite.university_id}
                        favorite={favorite}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
