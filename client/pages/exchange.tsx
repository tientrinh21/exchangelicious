import React from 'react';
import { Inter } from "next/font/google";
import "../app/globals.css";
import { SiteHeader } from "../components/site-header";
import { cn } from "../lib/utils";
import { HeaderString } from '../components/ex-page-uni-info';
import SearchBar from '../components/search-bar';

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background antialiased", inter.className)}>
      {/* Container to ensure consistent padding and alignment */}
      <div className="container mx-auto px-6 sm:px-8 max-w-screen-xl">
        <SiteHeader />

        <main className="flex-1">
          {/* Phrase section with consistent padding */}
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold">
              Connect more than <span className="primary-text">500</span> universities
            </h1>
          </div>

          {/* Filter and Search space section with the same container settings */}
          <div className="flex justify-between items-start">
            {/* Filter container */}
            <div className="w-1/4 bg-gray-400 p-4">
              Filter Container
            </div>

            {/* Search space */}
            <div className="w-3/4 bg-black text-white p-4 flex flex-col">
              <SearchBar />
              {/* Additional content like search results could go here */}
              <div className="search-content mt-4">
                Search Results or Content Area
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
