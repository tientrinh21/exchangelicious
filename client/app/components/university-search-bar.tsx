import { useEffect, useState } from "react";
import { University } from "../types/university";
import axios, { Canceler } from "axios";

const BASE_URL = 'http://127.0.0.1:8080/api'

// inspo: https://www.youtube.com/watch?v=NZKUirTtxcg
export default function useUniversitySearchBar(searchWord: string, pageNumber: number) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // to avoid blank screen when awaiting
    const [universities, setUniversities] = useState<University[]>([])
    const [hasMore, setHasMore] = useState(false)

    // when we change the query, reset the list of universities
    useEffect(() => {
      setUniversities([])
    }, [searchWord])

    // GET request
    useEffect(() => {
      // new request
      setIsLoading(true)
      setError(false)
      // avoids us calling the GET-method constantly
      let cancel: Canceler
      axios({
        method: "GET",
        url: `${BASE_URL}/universities/search`,
        headers: { 
          'Content-Type': 'application/json',
        },
        params: {page_number: pageNumber, search_word: searchWord},
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
        setHasMore(res.data["hasMore"])
        setUniversities(previousUniversities => {
          // combine the old and the newfound universities
          // ... is the spread operator
          return [...previousUniversities, ...res.data["items"]]
        })
        setIsLoading(false)
      }).catch(e => {
        if (axios.isCancel(e)) {
          return
        } 
        console.log(e)
        setError(true)
        setIsLoading(false)
      })
      // Stop constant recalls
      return () => cancel()
    }, [searchWord, pageNumber])

    return ( {
      isLoading, error, universities, hasMore
    }
  )
}


