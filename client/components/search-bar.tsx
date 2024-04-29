// components/SearchBar.tsx
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <form class="max-w-full mx-auto">
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
            <path stroke="#B9C1CA" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-lg text-muted-foreground font-semibold bg-background border-b-2 border-secondary rounded-t-lg focus:outline-none focus:border-b-3 focus:border-secondary-foreground focus:ring-0" // Adjusted focus border classes
          placeholder="Search universities by name, region, country, etc :)"
          required
        />
      </div>
    </form>
  );
}

export default SearchBar;
