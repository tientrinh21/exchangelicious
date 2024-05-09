/** @jsxImportSource react */
"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchBar } from "@/components/search-bar";
import { UniCard } from "@/components/uni-card";
import SortOption from "@/components/sort-option";
import universities from "@/types/universityobject";
import useUniversitySearchBar from '@/components/university-search-bar';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { University } from '@/types/university';
import { log } from 'console';

const BASE_URL = 'http://127.0.0.1:8080/api'


export default function ExchangePage1() {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // to avoid blank screen when awaiting
    const [universities, setUniversities] = useState<University[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [query, setQuery] = useState("")
    const [pageNumber, setPageNumber] = useState(2)

    // fetch inital data
    useEffect(() => {
        axios({
            method: "GET",
            url: `${BASE_URL}/universities/search`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { page_number: 1, search_word: query },
        }).then((res) => {
            console.log("initial axios call")
            console.log(res.data)
            setHasMore(res.data["hasMore"])
            setUniversities(res.data["items"])
        }).catch((err) => console.log(err));
    }, [query]);

    const fetchMoreData = () => {
        axios({
            method: "GET",
            url: `${BASE_URL}/universities/search`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { page_number: pageNumber, search_word: query },
        }).then((res) => {
            // setItems((prevItems) => [...prevItems, ...res.data]);
            console.log("Fetch more")

            console.log(res.data)
            setHasMore(res.data["hasMore"])
            setUniversities(previousUniversities => [...previousUniversities, ...res.data["items"]]);
            // combine the old and the newfound universities
            // ... is the spread operator
            // res.data.length > 0 ? setHasMore(true) : setHasMore(false);
            setPageNumber((prevIndex) => prevIndex + 1);

        })
            .catch((err) => console.log(err));
    };

    
    function handleSearch(e: any) {
        setQuery(e.target.value)
        setPageNumber(2)
        setUniversities([])
    }


    console.log("Length: " + universities.length)
    console.log("pagenumber: " + pageNumber)

    // return (
    //     <div>
    //         <InfiniteScroll
    //             dataLength={universities.length}
    //             next={(fetchMoreData)}
    //             hasMore={hasMore} // Replace with a condition based on your data source
    //             loader={<p>Loading...</p>}
    //             endMessage={<p>No more data to load.</p>}
    //         >
    //             {/* <ul> */}
    //             {universities.map(university => (
    //                 <UniCard key={university.university_id} university={university} />
    //             ))}
    //             {/* </ul> */}
    //         </InfiniteScroll>
    //     </div>
    // );

    return (
        <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl">
            <div className="text-center py-10">
                <h1 className="text-xl-plus font-bold text-secondary-foreground">
                    More than <span className="text-primary">500</span> universities are connected
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start">
                <div className="w-full lg:w-1/4 mb-4 lg:mb-0 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                    <div className="text-center">
                        Filter Container
                    </div>
                </div>

                <div className="w-full lg:w-3/4 p-4 flex flex-col">
                    <div className="w-full">
                        <form className="max-w-full mx-auto" >
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-muted-foreground sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-muted" />
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="placeholder-custom block w-full p-4 pl-14 text-lg text-secondary-foreground font-medium bg-background border-b-2 border-secondary rounded-t-lg focus:outline-none focus:border-b-3 focus:border-primary focus:ring-0"
                                    placeholder="Search universities by name, region, country, etc :)"
                                    // value={searchTerm}
                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                    value={query}
                                    onChange={handleSearch}

                                    style={{ textOverflow: 'ellipsis' }}
                                    required
                                />
                            </div>
                        </form>
                        {/* <SortOption sortType={sortType} setSortType={setSortType} /> */}
                    </div>

                    <div className="text-secondary-foreground search-content mt-0">
                        {isLoading && (<p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">Loading.</p>)}
                        {!isLoading && universities.length == 0 && (
                            <p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No matching results found.</p>
                        )}
                        {
                            !isLoading && universities.length > 0 && (
                                <div>
                                <InfiniteScroll
                                    dataLength={universities.length}
                                    next={(fetchMoreData)}
                                    hasMore={hasMore} // Replace with a condition based on your data source
                                    loader={<p>Loading...</p>}
                                    endMessage={<p>No more data to load.</p>}
                                >
                                    {/* <ul> */}
                                    {universities.map(university => (
                                        <UniCard key={university.university_id} university={university} />
                                    ))}
                                    {/* </ul> */}
                                </InfiniteScroll>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}





// export function ExchangePage() {

//     const [query, setQuery] = useState("")
//     const [pageNumber, setPageNumber] = useState(1)

//     const {
//         isLoading,
//         error,
//         universities,
//         hasMore
//     } = useUniversitySearchBar(query, pageNumber)

//     const observer = useRef<any>()
//     const lastUniversityElementRef = useCallback((node: any) => {
//         // we are loading - do not do anything
//         if (isLoading) {
//             return
//         }
//         // remove previous observers
//         if (observer.current) {
//             observer.current.disconnect()
//         }

//         observer.current = new IntersectionObserver(entries => {
//             // if the last university is visible on the page
//             // and we have more universities in the database
//             if (entries[0].isIntersecting && hasMore) {
//                 // then update the pagination page number
//                 setPageNumber(prevPageNumber => prevPageNumber + 1)
//             }
//         })
//         // Observe the last university
//         if (node) {
//             observer.current.observe(node)
//         }
//     }, [isLoading, hasMore])


//     function handleSearch(e: any) {
//         setQuery(e.target.value)
//         setPageNumber(1)
//     }

//     // const [searchTerm, setSearchTerm] = useState('');
//     // const [sortType, setSortType] = useState('');

//     // const handleSearchChange = (event:any) => {
//     //     setSearchTerm(event.target.value);
//     // };

//     // const sortedUniversities = [...universities].filter(university =>
//     //     university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     //     university.region.toLowerCase().includes(searchTerm.toLowerCase())
//     // ).sort((a, b) => {
//     //     switch(sortType) {
//     //         case 'name-asc':
//     //             return a.name.localeCompare(b.name);
//     //         case 'name-desc':
//     //             return b.name.localeCompare(a.name);
//     //         case 'ranking-asc':
//     //             return a.ranking - b.ranking;
//     //         case 'ranking-desc':
//     //             return b.ranking - a.ranking;
//     //         default:
//     //             return 0;
//     //     }
//     // });

//     return (
//         <div className="container mx-auto px-4 sm:px-8 max-w-screen-xl">
//             <div className="text-center py-10">
//                 <h1 className="text-xl-plus font-bold text-secondary-foreground">
//                     More than <span className="text-primary">500</span> universities are connected
//                 </h1>
//             </div>

//             <div className="flex flex-col lg:flex-row justify-between items-start">
//                 <div className="w-full lg:w-1/4 mb-4 lg:mb-0 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
//                     <div className="text-center">
//                         Filter Container
//                     </div>
//                 </div>

//                 <div className="w-full lg:w-3/4 p-4 flex flex-col">
//                     <div className="w-full">
//                         <form className="max-w-full mx-auto" >
//                             <label htmlFor="default-search" className="mb-2 text-sm font-medium text-muted-foreground sr-only dark:text-white">Search</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                                     {/* Search icon here */}
//                                 </div>
//                                 <input
//                                     type="search"
//                                     id="default-search"
//                                     className="placeholder-custom block w-full p-4 pl-10 text-lg text-secondary-foreground font-medium bg-background border-b-2 border-secondary rounded-t-lg focus:outline-none focus:border-b-3 focus:border-primary focus:ring-0"
//                                     placeholder="Search universities by name, region, country, etc :)"
//                                     // value={searchTerm}
//                                     // onChange={(e) => setSearchTerm(e.target.value)}
//                                     value={query}
//                                     onChange={handleSearch}

//                                     style={{ textOverflow: 'ellipsis' }}
//                                     required
//                                 />
//                             </div>
//                         </form>
//                         {/* <SortOption sortType={sortType} setSortType={setSortType} /> */}
//                     </div>

//                     <div className="text-secondary-foreground search-content mt-0">
//                         {isLoading && (<p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">Loading.</p>)}
//                         {!isLoading && universities.length == 0 && (
//                             <p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No matching results found.</p>
//                         )}
//                         {
//                             !isLoading && universities.length > 0 && (
//                                 <div>
//                                     {universities.map((university, index) => {
//                                         // return <UniCard key={university.university_id} university={university} />
//                                         // Infinite scroll is turned of right now
//                                         if (universities.length === index + 1) {
//                                             return <div key={university.university_id} ref={lastUniversityElementRef}><UniCard key={university.university_id} university={university} /></div>
//                                         } else {
//                                             return <UniCard key={university.university_id} university={university} />
//                                         }
//                                     })}
//                                 </div>
//                             )
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


