/** @jsxImportSource react */ 
"use client" 

import React, { useState } from 'react';
import { SearchBar } from "@/components/search-bar"
import { UniCard } from "@/components/uni-card";
import type { UniversityObject } from "@/types/university";
import universities from "@/types/universityobject";

export default function ExchangePage() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUniversities = universities.filter(university =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-6 sm:px-8 max-w-screen-xl">
            <div className="text-center py-10">
              <h1 className="text-xl-plus font-bold text-secondary-foreground">
                More than <span className="text-primary">500</span> universities are connected
              </h1>
            </div>

          <div className="flex justify-between items-start">
            <div className="w-1/4 h-96 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
              <div className="text-center">
                Filter Container
              </div>
            </div>

            <div className="w-3/4 p-4 flex flex-col">
              <div className="w-full">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <div className="text-secondary-foreground search-content mt-4">
                {
                  filteredUniversities.length > 0 ? filteredUniversities.map((university) => (
                    <UniCard key={university.code} university={university} />
                  )) : <p className="text-center text-lg font-semibold mt-20 text-secondary-foreground">No results found.</p>
                }
              </div>
            </div>
          </div>
        </div>
    );
}
