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


export default function ExchangePage() {
    const [error, setError] = useState(false);
    const [universities, setUniversities] = useState<University[]>([])
    const [isLoading, setIsLoading] = useState(true); // to avoid blank screen when awaiting
    const [hasMore, setHasMore] = useState(true)
    const [query, setQuery] = useState("")
    const [pageNumber, setPageNumber] = useState(2)

    // fetch initial data
    useEffect(() => {
        setIsLoading(true)
        axios({
            method: "GET",
            url: `${BASE_URL}/universities/search`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { page_number: 1, search_word: query },
        }).then((res) => {
            setHasMore(res.data["hasMore"])
            setUniversities(res.data["items"])
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            setIsLoading(false)
        });
    }, [query]);

    const fetchMoreData = () => {
        setIsLoading(true)
        axios({
            method: "GET",
            url: `${BASE_URL}/universities/search`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { page_number: pageNumber, search_word: query },
        }).then((res) => {
            setHasMore(res.data["hasMore"])
            setUniversities(previousUniversities => [...previousUniversities, ...res.data["items"]]);
            setPageNumber((prevIndex) => prevIndex + 1);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            setIsLoading(false)
        });
    };

    function handleSearch(e: any) {
        setQuery(e.target.value)
        setPageNumber(2)
        setUniversities([])
    }

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
                        {universities.length > 0 && (
                                <InfiniteScroll
                                    dataLength={universities.length}
                                    next={(fetchMoreData)}
                                    hasMore={hasMore} // Replace with a condition based on your data source
                                    loader={<p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">Loading.</p>}
                                    endMessage={<p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No more results found.</p>
                                }
                                >
                                    {universities.map(university => (
                                        <UniCard key={university.university_id} university={university} />
                                    ))}
                                </InfiniteScroll>
                            )
                        }
                        {!isLoading && universities.length == 0 && (
                            <p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No matching results found.</p>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
