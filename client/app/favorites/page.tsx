'use client'

import { FavoriteCard } from '@/components/favorite-card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { getUserData, isAuthenticated } from '@/lib/auth'
import { University } from '@/types/university'
import axios from 'axios'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

export default function ExchangePage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(2)

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
        setUniversities(res.data['items'])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [typeof window !== 'undefined'])

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
        setUniversities((previousUniversities) => [
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
              {isLoading && (
                <LoadingSpinner className="my-10" text="Loading..." />
              )}
              {!isLoading && universities.length == 0 && (
                <p className="my-10 text-center text-lg font-semibold text-secondary-foreground">
                  No matching results found.
                </p>
              )}

              {universities.length > 0 && (
                <InfiniteScroll
                  dataLength={universities.length}
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
                    {universities.map((university) => (
                      <FavoriteCard
                        key={university.university_id}
                        university={university}
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
