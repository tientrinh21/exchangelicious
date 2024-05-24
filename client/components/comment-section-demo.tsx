import { getUserData } from '@/lib/auth'
import { Review } from '@/types/review-section'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const BASE_URL = 'http://127.0.0.1:8080/api'

// function getReviewsPerUniversity(university_id: string) {
//     const [error, setError] = useState(false)
//     const [isLoading, setIsLoading] = useState(false)
//     const [reviews, setReviews] = useState<Review[]>([])    

//     useEffect(() => {
//         setIsLoading(true)
//         setError(false)
//         axios({
//             method: "GET",
//             url: `${BASE_URL}/reviews`,
//             params: {university_id: university_id}
//         }).then((res) => {
//             console.log(res.data)
//             setReviews(res.data)
//             setIsLoading(false)
//         }).catch((e) => {
//             console.log(e)
//             setError(true)
//             setIsLoading(false)
//         })
//     }, [])
    
//     return {
//         isLoading,
//         error,
//         reviews
//     }
// }

function MakeComment(props: {university_id: string}) {

  console.log(getUserData())

  function createReview(formData:any) {
    axios({
      method: 'POST',
      url: `${BASE_URL}/review`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: { user_id: getUserData().user_id, 
                university_id: props.university_id, 
                title: formData.get("title"),
                content: formData.get("content"),
                mood_score: formData.get("mood_score")
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
      <input name="title" placeholder='title'/>
      <input name="content" placeholder='content'/>
      <select name="mood_score">
      {/* TODO: Should handle ENUM differently on the front end */}
        <option value="very bad">very bad</option>
        <option value="bad">bad</option>
        <option value="neutral">neutral</option>
        <option value="good">good</option>
        <option value="very good">very good</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}


export default function CommentSectionDemo(props: {university_id: string}) {
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
      params: { university_id: props.university_id, page_number: 1},
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
      params: { university_id: props.university_id, page_number: pageNumber},
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
    {isLoading && (<div>Loading ...</div>)}
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
                <>
                <li key={review.review_id}>Author: {review.user_id} + {review.title} + {review.mood_score} + {review.content} + {review.upvotes} - {review.downvotes} = {review.upvotes - review.downvotes} </li>
                <ul>
                  <li><button name='upvote'>Up vote</button></li>
                  <li><button name='downvote'>Down vote</button></li>
                </ul>
                </>
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

// https://react.semantic-ui.com/views/comment/#types-comment
// export default function CommentSectionDemo(props: {university_id: string}) {
// export default function CommentSectionDemo(props: {university_id: string}) {
//     console.log(props.university_id)

//     const {
//         isLoading,
//         error,
//         reviews
//     } = getReviewsPerUniversity(props.university_id)

//     console.log(reviews.length)
//     console.log(isLoading)
//     return (
//         <>
//         <h1>All the reviews about this university in the database:</h1>
//       {isLoading && (<div>Loading ...</div>)}
//       {!isLoading && reviews.length > 0 && (
//         <ul>
//           {reviews.map((review) => {
//             // TODO: We need the username of a user
//             return <li key={review.review_id}>Author: {review.user_id} + {review.title} + {review.mood_score} + {review.content}</li>
//           })}
//         </ul>
//       )} 

//         </>
//     )

    // return (
    //     <div className="w-fullbg-white rounded-lg border p-1 md:p-3 m-10">
    //     <h3 className="font-semibold p-1">Discussion</h3>
    //     <div className="flex flex-col gap-5 m-3">
    
    //         {/* <!-- Comment Container --> */}
    //         <div>
    //             <div className="flex w-full justify-between border rounded-md">
    
    //                 <div className="p-3">
    //                     <div className="flex gap-3 items-center">
    //                         <img src="https://avatars.githubusercontent.com/u/22263436?v=4"
    //                                 className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400" />
    //                         <h3 className="font-bold">
    //                             User 1
    //                             <br/>
    //                             <span className="text-sm text-gray-400 font-normal">Level 1</span>
    //                         </h3>
    //                     </div>
    //                     <p className="text-gray-600 mt-2">
    //                         this is sample commnent
    //                     </p>
    //                     <button className="text-right text-blue-500">Reply</button>
    //                 </div>
    
    
    //                 <div className="flex flex-col items-end gap-3 pr-3 py-3">
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    //                         </svg>
    //                     </div>
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    //                         </svg>
    //                     </div>
    //                 </div>
    
    //             </div>
    
    
    
    
    //             {/* <!-- Reply Container  --> */}
    //             <div className="text-gray-300 font-bold pl-14">|</div>
    //             <div className="flex justify-between border ml-5  rounded-md">
    
    //                 <div className="p-3">
    //                     <div className="flex gap-3 items-center">
    //                         <img src="https://avatars.githubusercontent.com/u/22263436?v=4"
    //                                 className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400" />
    //                         <h3 className="font-bold">
    //                             User 2
    //                             <br/>
    //                             <span className="text-sm text-gray-400 font-normal">Level 1</span>
    //                         </h3>
    //                     </div>
    //                     <p className="text-gray-600 mt-2">
    //                         this is sample commnent
    //                     </p>
    //                 </div>
    
    
    //                 <div className="flex flex-col gap-3 pr-3 py-3">
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    //                         </svg>
    //                     </div>
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    //                         </svg>
    //                     </div>
    //                 </div>
    
    //             </div>
    //             {/* <!-- END Reply Container  --> */}
    
    
    
    //             {/* <!-- Reply Container  --> */}
    //             <div className="text-gray-300 font-bold pl-14">|</div>
    //             <div className="flex justify-between border ml-5  rounded-md">
    //                 <div className="p-3">
    //                     <div className="flex gap-3 items-center">
    //                         <img src="https://avatars.githubusercontent.com/u/22263436?v=4"
    //                                 className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400" />
    //                         <h3 className="font-bold">
    //                             User 3
    //                             <br/>
    //                             <span className="text-sm text-gray-400 font-normal">Level 1</span>
    //                         </h3>
    //                     </div>
    //                     <p className="text-gray-600 mt-2">
    //                         this is sample commnent
    //                     </p>
    //                 </div>
    
    
    //                 <div className="flex flex-col gap-3 pr-3 py-3">
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    //                         </svg>
    //                     </div>
    //                     <div>
    //                         <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                             viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    //                         </svg>
    //                     </div>
    //                 </div>
    
    //             </div>
    //             {/* <!-- END Reply Container  --> */}
    
    //         </div>
    //         {/* <!-- END Comment Container  --> */}
    
    //         <div className="flex w-full justify-between border rounded-md">
    //             <div className="p-3">
    
    //                 <div className="flex gap-3 items-center">
    //                     <img src="https://avatars.githubusercontent.com/u/22263436?v=4"
    //                             className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"/>
    //                     <h3 className="font-bold">
    //                         User 4
    //                         <br/>
    //                         <span className="text-sm text-gray-400 font-normal">Level 1</span>
    //                     </h3>
    
    //                 </div>
    //                 <p className="text-gray-600 mt-2">
    //                     this is sample commnent
    //                 </p>
    //                 <button className="text-right text-blue-500">Reply</button>
    //             </div>
    
    //             <div className="flex flex-col gap-3 p-3">
    //                 <div>
    //                     <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                         viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                         <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    //                     </svg>
    //                 </div>
    //                 <div>
    //                     <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
    //                         viewBox="0 0 24 24" stroke-width="5" stroke="currentColor">
    //                         <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    //                     </svg>
    //                 </div>
    //             </div>
    //         </div>
    
    //     </div>
    
    
    
    //     <div className="w-full px-3 mb-2 mt-6">
    //         <textarea
    //                 className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
    //                 name="body" placeholder="Comment" required></textarea>
    //     </div>
    
    //     <div className="w-full flex justify-end px-3 my-3">
    //         <input type="submit" className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 text-lg" value='Post Comment'/>
    //     </div>
    
    
    // </div>
    // )
  }



