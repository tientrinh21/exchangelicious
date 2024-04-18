import { useEffect, useState } from "react";
import { University } from "../types/university";

const BASE_URL = 'http://127.0.0.1:8080/api'

// inspo: https://www.youtube.com/watch?v=NZKUirTtxcg
export default function UniversitySearchBar(query: String, pageNumber: number) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // to avoid blank screen when awaiting
    const [universities, setUniversities] = useState<University[]>([])
    const [hasMore, setMore] = useState()
    // GET request
  
    useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
    //   setError(false)
      // Error handling
      try {
        // Call the api and cast the response via json
        const response = await fetch(`${BASE_URL}/universities/${encodeURIComponent(pageNumber)}`);
        const result = await response.json() as University[];
        console.log(result)
        setUniversities(result)
        // We should probably handle this better 
      } catch (error: any) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchUsers();
  }, [query, pageNumber])
  
  
    return (
        null
  )
}