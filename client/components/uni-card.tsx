import React from 'react';
import Link from 'next/link'; 
import type { UniversityObject } from '@/types/university';

export function UniCard(props: { university: UniversityObject }) {
  return (
    <Link href={`/exchange/${props.university.code}`}>
      <div className="block text-left">
        <div className="max-w-full mx-auto p-4 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-100 transition-colors duration-150 rounded-lg cursor-pointer">
          {/* Combined Section for Mobile, split into Left and Right for Desktop */}
          <div className="flex flex-col flex-grow sm:text-left">
            <h2 className="text-xl-plus text-secondary-foreground font-bold mb-1.5">{props.university.name}</h2>
            <p className="text-muted font-medium mb-1.5">{props.university.region} | {props.university.campus}</p>
          </div>

          <div className="flex flex-col text-left sm:text-right pl-0 sm:pl-4 sm:flex-grow">
            <p className="text-muted font-medium mb-1.5">QS Ranking: {props.university.ranking}</p>
            <p className="text-muted font-medium">Dormitory: {props.university.dorm ? "Available" : "Not Available"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
