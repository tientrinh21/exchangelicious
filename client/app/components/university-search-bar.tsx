import { useEffect, useState } from "react";
import { University } from "../types/university";
import axios, { Axios, CancelToken, Canceler } from "axios";
import { loadBindings } from "next/dist/build/swc";
import { log } from "console";

const BASE_URL = 'http://127.0.0.1:8080/api'

// inspo: https://www.youtube.com/watch?v=NZKUirTtxcg
export default function UniversitySearchBar(query: string, pageNumber: number) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // to avoid blank screen when awaiting
    const [universities, setUniversities] = useState<University[]>([])
    const [hasMore, setHasMore] = useState(false)

    // when we change the query, reset the list of universities
    useEffect(() => {
      setUniversities([])
    }, [query])

    // GET request
    useEffect(() => {
      console.log(hasMore)
      // TODO: Fix stupid workaround
      if (query == "") {
        query = "#00"
      }
      // new request
      setIsLoading(true)
      setError(false)
      let cancel: Canceler
      axios({
        method: "GET",
        url: `${BASE_URL}/universities/${encodeURIComponent(pageNumber)}/${encodeURIComponent(query)}`,
        // url: `${BASE_URL}/universities/`,
        // params: {query: query, page_num: pageNumber},
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
        setUniversities(previousUniversities => {
          // combine the old and the newfound universities
          // ... is the spread operator
          return [...previousUniversities, ...res.data]
        })
        setIsLoading(false)
        // TODO: Has more does not work as intended 
        // how do we know that we dont have any more universities to load?
        // Do we have more universities to load?
        setHasMore(res != null && res.data.length > 0)
        // console.log(res.data)
        // console.log(res.data)
        // console.log(universities)
        console.log(hasMore)
      }).catch(e => {
        if (axios.isCancel(e)) {
          return
        } 
        setHasMore(false)
        setError(true)
        setIsLoading(false)
      })
      // Stop constant recalls
      return () => cancel()
    }, [query, pageNumber])
  
    // useEffect(() => {
    // const fetchUsers = async () => {
    //   setIsLoading(true)
    // //   setError(false)
    //   // Error handling
    //   try {
    //     // Call the api and cast the response via json
    //     const response = await fetch(`${BASE_URL}/universities/${encodeURIComponent(pageNumber)}`);
    //     const result = await response.json() as University[];
    //     console.log(result)
    //     setUniversities(result)
    //     // We should probably handle this better 
    //   } catch (error: any) {
    //     setError(error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // };

  //   fetchUsers();
  // }, [query, pageNumber])
  
  
    return ( {
      isLoading, error, universities, hasMore
    }
  )
}