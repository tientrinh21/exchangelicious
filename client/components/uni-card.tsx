import React from 'react'
import Link from 'next/link'
import type { University } from '@/types/university'
import countries from '@/lib/countries.json'
import { getCountryName } from '@/lib/utils'

export function UniCard(props: { university: University }) {
  return (
    <Link href={`/exchange/${props.university.university_id}`} className="z-0">
      <div className="block text-left">
        <div className="mx-auto flex max-w-full cursor-pointer flex-col items-start justify-between rounded-lg border-2 border-gray-100 bg-white px-8 py-4 shadow transition-colors duration-150 hover:bg-gray-100 lg:flex-row lg:items-center">
          {/* Combined Section for Mobile, split into Left and Right for Desktop */}
          <div className="flex flex-grow flex-col sm:text-left">
            <h2 className="text-xl-plus mb-1 font-bold text-secondary-foreground lg:text-2xl">
              {props.university.long_name}
            </h2>
            <p className="flex flex-col font-medium text-muted sm:flex-row">
              <span>{props.university.campus ?? 'N/A'}</span>
              <span className="mx-1.5 hidden sm:inline">|</span>
              <span>
                {props.university.region ?? 'N/A'} -{' '}
                {getCountryName(props.university.country_code)}
              </span>
            </p>
          </div>

          <div className="flex flex-col pl-0 text-left sm:w-full lg:w-fit lg:min-w-[205px] lg:flex-col lg:pl-4 lg:text-right">
            <p className="font-medium text-muted">
              QS Ranking: {props.university.ranking ?? 'N/A'}
            </p>
            <p className="font-medium text-muted">
              Housing: {props.university.housing}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
