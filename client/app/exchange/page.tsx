'use client'

import { AddUniDialog } from '@/components/add-uni-dialog'
import { LoadingSpinner } from '@/components/loading-spinner'
import { UniCard } from '@/components/uni-card'
import { University } from '@/types/university'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

export default function ExchangePage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(2)

  // fetch initial data
  useEffect(() => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/universities/search`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: { page_number: 1, search_word: query },
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
  }, [query])

  const fetchMoreData = () => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/universities/search`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: { page_number: pageNumber, search_word: query },
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

  function handleSearch(e: any) {
    setQuery(e.target.value)
    setPageNumber(2)
    setUniversities([])
  }

  return (
    <>
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-8">
        <div className="py-5 text-center md:py-8">
          <h1 className="text-xl-plus font-bold text-secondary-foreground">
            More than <span className="text-primary">70</span> universities are
            connected
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between lg:flex-row">
          <div className="flex w-full flex-col">
            <div className="w-full">
              <form className="mx-auto max-w-full">
                <label htmlFor="default-search" className="sr-only">
                  Search
                </label>
                <div className="relative mx-2 mb-5">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center px-2">
                    <MagnifyingGlassIcon className="h-5 w-5 text-placeholder" />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="focus:border-b-3 block w-full rounded-t-lg border-b-2 border-secondary bg-background p-2 pl-10 text-lg font-medium text-secondary-foreground placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-0 sm:pl-12"
                    placeholder="Search universities by name, region, country, etc."
                    value={query}
                    onChange={handleSearch}
                    style={{ textOverflow: 'ellipsis' }}
                    required
                  />
                </div>
              </form>
            </div>

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
                      <UniCard
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
      <AddUniDialog />
    </>
  )
}
