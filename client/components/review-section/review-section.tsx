'use client'

import { getUserData, isAuthenticated } from '@/lib/auth'
import { Review } from '@/types/review-section'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CreateReviewForm } from './create-review-form'
import { ReviewCard } from './review-card'
import { atom, useAtom } from 'jotai'

const BASE_URL = 'http://127.0.0.1:8080/api'

export const atomReloadReviews = atom(false)

export default function ReviewSection(props: { university_id: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(2)

  const [reloadReviews, setReloadReviews] = useAtom(atomReloadReviews)

  // fetch initial data
  useEffect(() => {
    setIsLoading(true)
    setPageNumber(2)

    axios({
      method: 'GET',
      url: `${BASE_URL}/reviews/paginate`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        university_id: props.university_id,
        page_number: 1,
        user_id: isAuthenticated() ? getUserData().user_id : null,
      },
    })
      .then((res) => {
        setHasMore(res.data['hasMore'])
        setReviews(res.data['items'])
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })

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
        university_id: props.university_id,
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
        console.log(err)
        setIsLoading(false)
      })
  }

  return (
    <div className="w-full">
      <CreateReviewForm university_id={props.university_id} />

      <div>
        <h1 className="mb-5 mt-10 text-center text-lg font-bold text-foreground lg:text-left">
          All the reviews about this university in the database:
        </h1>
        {isLoading && <div>Loading ...</div>}
        {!isLoading && reviews.length == 0 && (
          <p className="mt-20 text-center text-lg font-semibold text-secondary-foreground">
            No reviews found.
          </p>
        )}

        {/* TODO: Make a sort by button */}
        {reviews.length > 0 && (
          <InfiniteScroll
            dataLength={reviews.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <p className="mt-20 text-center text-lg font-semibold text-secondary-foreground">
                Loading...
              </p>
            }
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
