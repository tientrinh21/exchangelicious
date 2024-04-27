import React, {useState, useRef, useCallback} from 'react'
import UniversitySearchBar from "./university-search-bar"
import { University } from '../types/university'

export default function PaginationDemo() {
    const [query, setQuery] = useState("")
    const [pageNumber, setPageNumber] = useState(1)

    const {
        isLoading,
        error,
        universities,
        hasMore
    } =  UniversitySearchBar(query, pageNumber)

    const observer = useRef<any>()
    const lastUniversityElementRef = useCallback((node: HTMLElement | null)=> {
        // we are loading - do not do anything
        if (isLoading) {
            return
        }
        // remove previous observers
        if (observer.current) {
            observer.current.disconnect() 
        } 

        observer.current = new IntersectionObserver(entries => {
            // if the last university is visible on the page
            // and we have more universities in the database
            if (entries[0].isIntersecting && hasMore) {
                // then update the pagination page number
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        // Observe the last university
        if (node) {
            observer.current.observe(node)
        }
    }, [isLoading, hasMore])
   

    function handleSearch(e: any ) {
        setQuery(e.target.value)
        setPageNumber(1)
    }

  return (
    <div>
        <div className="mb-3 xl:w-96">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <input
                  type="text"
                  className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="button-addon2"
            
                // Stuff needed for pagination and searching
                  value={query}
                  onChange={handleSearch}
                  />

              {/* <!--Search icon--> */}
              <span
                  className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                  id="basic-addon2">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5">
                      <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd" />
                  </svg>
              </span>
          </div>
      </div>
      <div>
        {/* The ref setup below is needed for searching and pagination */}
      <h1>All the universities in the search</h1>
      {isLoading && (<div>Loading ...</div>)}
      {!isLoading && universities.length ==  0 && (
        <p>No matching results for the search </p>
      )}
      {!isLoading && universities.length > 0 && (
        <ul>
          {universities.map((university, index) => {
            if (universities.length === index + 1) {
                return <li ref={lastUniversityElementRef} key={university.university_id}>{university.long_name} + {university.country_code}</li>
            } else {
                return <li key={university.university_id}>{university.long_name} + {university.country_code}</li>
            }
          })}
        </ul>
      )}

    </div>
    </div>
  )
}
