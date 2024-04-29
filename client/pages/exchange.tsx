import React from 'react';
import { Inter } from "next/font/google";
import "../app/globals.css";
import { SiteHeader } from "../components/site-header";
import { cn } from "../lib/utils";
import { HeaderString } from '../components/ex-page-uni-info';
import SearchBar from '../components/search-bar';
import SearchResult from '../components/search-result'

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background antialiased", inter.className)}>
      {/* Container to ensure consistent padding and alignment */}
      <SiteHeader />

      <div className="container mx-auto px-6 sm:px-8 max-w-screen-xl">

        <main className="flex-1">
          {/* Phrase section with consistent padding */}
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-secondary-foreground">
              More than <span className="primary-text">500</span> universities are connected
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
            <div class="w-full">
              <SearchBar />
            </div>
              {/* Search Results */}
              <div className="text-secondary-foreground search-content mt-4">
                <SearchResult />
                <SearchResult />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Additional children might be placed here maintaining the consistent layout */}
      {children}
      {/* TODO: Implement site footer */}
      {/* <SiteFooter /> */}
    </div>
  );
}
