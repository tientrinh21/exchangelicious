import { getUserData, isAuthenticated } from '@/lib/auth'
import { Review } from '@/types/review-section'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const BASE_URL = 'http://127.0.0.1:8080/api'

function MakeComment(props: { university_id: string }) {
  // console.log(getUserData())

  function createReview(formData: any) {
    axios({
      method: 'POST',
      url: `${BASE_URL}/review`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_id: getUserData().user_id,
        university_id: props.university_id,
        title: formData.get('title'),
        content: formData.get('content'),
        mood_score: formData.get('mood_score'),
      },
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <form action={createReview}>
      <input name="title" placeholder="title" />
      <input name="content" placeholder="content" />
      <select name="mood_score">
        {/* TODO: Should probably handle ENUM differently on the front end */}
        <option value="very bad">very bad</option>
        <option value="bad">bad</option>
        <option value="neutral">neutral</option>
        <option value="good">good</option>
        <option value="very good">very good</option>
      </select>
      <button type="submit">Commit</button>
    </form>
  )
}

export default function CommentSectionDemo(props: { university_id: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true) // to avoid blank screen when awaiting
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(2)

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
  }, [])

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
    // TODO: After a the comment has been added. You need to reset the infinite scroll
    // (or something, so that the new comment shows up)
  }

  return (
    <>
      {/* TODO: Should only be visible if the user is logged in */}
      <MakeComment university_id={props.university_id}></MakeComment>
      <h1>All the reviews about this university in the database:</h1>
      {isLoading && <div>Loading ...</div>}
      {/* TODO: Make a sort by button */}
      {!isLoading && reviews.length > 0 && (
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
            <ul>
              {reviews.map((review) => (
                // TODO: Make pretty review cards
                <div key={review.review_id}>
                  <li key={review.review_id}>
                    Author: {review.user_id} + {review.title} +{' '}
                    {review.mood_score} + {review.content} + {review.upvotes} -{' '}
                    {review.downvotes} = {review.upvotes - review.downvotes} +
                    has_upvoted: {String(review.has_upvoted)} + has_downvoted:{' '}
                    {String(review.has_downvoted)}{' '}
                  </li>
                  <ul>
                    {/* TODO: A user can either upvote or downvote a review */}
                    <li>
                      <button name="upvote">Up vote</button>
                    </li>
                    <li>
                      <button name="downvote">Down vote</button>
                    </li>
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        </InfiniteScroll>
      )}
      {!isLoading && reviews.length == 0 && (
        <p className="mt-20 text-center text-lg font-semibold text-secondary-foreground">
          No reviews found.
        </p>
      )}
    </>
  )
}
