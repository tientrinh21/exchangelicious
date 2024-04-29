import { SearchBar } from "@/components/search-bar"
import { SearchResult } from "@/components/search-result";

export default function ExchangePage() {
    return (
        <div className="container mx-auto px-6 sm:px-8 max-w-screen-xl">
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-secondary-foreground">
                More than <span className="text-primary">500</span> universities are connected
              </h1>
            </div>

          {/* Filter and Search space section with the same container settings */}
          <div className="flex justify-between items-start">
            {/* Filter container */}
            <div className="w-1/4 h-96 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
              <div className="text-center">
                Filter Container
              </div>
            </div>

            {/* Search space */}
            <div className="w-3/4 text-black p-4 flex flex-col">
            <div className="w-full">
              <SearchBar />
            </div>
              {/* Search Results */}
              <div className="text-secondary-foreground search-content mt-4">
                <SearchResult />
                <SearchResult />
              </div>
            </div>
          </div>
        </div>
    )
}