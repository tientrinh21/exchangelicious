'use client'

import { getUserData, isAuthenticated } from '@/lib/auth'
import { Review } from '@/types/review'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CreateReviewForm } from './create-review-form'
import { ReviewCard } from './review-card'
import { atom, useAtom, useAtomValue } from 'jotai'
import { SortingButton } from './sorting-button'
import { LoadingSpinner } from '@/components/loading-spinner'

const BASE_URL = 'http://127.0.0.1:8080/api'

export const atomReloadReviews = atom(false)
export const atomSortOption = atom('default')

export default function ReviewSection(props: { uniId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(2)

  const [reloadReviews, setReloadReviews] = useAtom(atomReloadReviews)
  const sortOption = useAtomValue(atomSortOption)

  // fetch initial data
  useEffect(() => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/reviews/paginate`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        university_id: props.uniId,
        page_number: 1,
        user_id: isAuthenticated() ? getUserData().user_id : null,
        order_by: sortOption,
      },
    })
      .then((res) => {
        setHasMore(res.data['hasMore'])
        setReviews(res.data['items'])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })

    // Needed for with review operations
    setPageNumber(2)
    setReloadReviews(false)
  }, [reloadReviews])

  const fetchMoreData = () => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${BASE_URL}/reviews/paginate`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        university_id: props.uniId,
        page_number: pageNumber,
        user_id: isAuthenticated() ? getUserData().user_id : null,
      },
    })
      .then((res) => {
        setHasMore(res.data['hasMore'])
        setReviews((previousUniversities) => [
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
    <div className="w-full">
      <CreateReviewForm university_id={props.uniId} />

      <div>
        <div className="mb-0.5 mt-10 flex flex-col gap-5 md:mb-5 md:flex-row md:items-center md:justify-between">
          <h1 className="text-center text-lg font-bold text-foreground md:text-left">
            All the reviews about this university in the database:
          </h1>

          <SortingButton />
        </div>

        {isLoading && <LoadingSpinner className="my-10" text="Loading..." />}
        {!isLoading && reviews.length == 0 && (
          <p className="my-10 text-center text-lg font-semibold text-secondary-foreground">
            No reviews found.
          </p>
        )}

        {reviews.length > 0 && (
          <InfiniteScroll
            dataLength={reviews.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<LoadingSpinner className="my-10" text="Loading..." />}
            endMessage={
              <p className="my-10 text-center text-lg font-semibold text-secondary-foreground">
                No more reviews found.
              </p>
            }
          >
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
