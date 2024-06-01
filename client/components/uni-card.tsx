import React from 'react'
import Link from 'next/link'
import type { University } from '@/types/university'

export function UniCard(props: { university: University }) {
  return (
    <Link href={`/exchange/${props.university.university_id}`} className="z-0">
      <div className="block text-left">
        <div className="mx-auto flex max-w-full cursor-pointer flex-col items-start justify-between rounded-lg border-2 border-gray-100 bg-white px-8 py-4 shadow transition-colors duration-150 hover:bg-gray-100 lg:flex-row lg:items-center">
          {/* Combined Section for Mobile, split into Left and Right for Desktop */}
          <div className="flex flex-grow flex-col sm:text-left">
            <h2 className="mb-1.5 text-xl-plus font-bold text-secondary-foreground">
              {props.university.long_name}
            </h2>
            <p className="mb-1.5 font-medium text-muted">
              {props.university.region} | {props.university.campus}
            </p>
          </div>

          <div className="flex flex-col pl-0 text-left sm:w-full sm:flex-grow sm:flex-row sm:justify-between lg:w-fit lg:flex-col lg:justify-normal lg:pl-4 lg:text-right">
            <p className="mb-1.5 font-medium text-muted">
              QS Ranking: {props.university.ranking}
            </p>
            <p className="font-medium text-muted">
              Dormitory:{' '}
              {props.university.housing ? 'Available' : 'Not Available'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
