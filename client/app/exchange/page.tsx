/** @jsxImportSource react */ 
"use client" 

import React, { useState } from 'react';
import { SearchBar } from "@/components/search-bar";
import { UniCard } from "@/components/uni-card";
import SortOption from "@/components/sort-option"; // 정렬 필터 컴포넌트 임포트
import universities from "@/types/universityobject";

export default function ExchangePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const sortedUniversities = [...universities].filter(university =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.region.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        switch(sortType) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'ranking-asc':
                return a.ranking - b.ranking;
            case 'ranking-desc':
                return b.ranking - a.ranking;
            default:
                return 0;
        }
    });

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
                      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                      <SortOption sortType={sortType} setSortType={setSortType} />
                    </div>
                    <div className="text-secondary-foreground search-content mt-0">
                        {
                            sortedUniversities.length > 0 ? sortedUniversities.map((university) => (
                                <UniCard key={university.code} university={university} />
                            )) : <p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No results found.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


