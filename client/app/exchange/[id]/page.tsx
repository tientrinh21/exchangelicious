'use client'

import { InfoReviewsNav } from '@/components/info-reviews-nav'
import {
  UniInfoContent,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
// import testData from '@/lib/seed.json'
import { EditInfoButton } from '@/components/edit-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'

const BASE_URL = 'http://localhost:8080/api'

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json())

export default function InfoPage() {
  // TODO: To be change soon
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  // const uniData = testData[uniName as keyof Object]
  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/universities/${uniName}/info`,
    fetcher,
  )

  if (error)
    return (
      <>
        <InfoReviewsNav />
        <p className="font-medium text-secondary-foreground sm:text-lg">
          Failed to load
        </p>
      </>
    )

  if (isLoading)
    return (
      <>
        <InfoReviewsNav />
        <p className="font-medium text-secondary-foreground sm:text-lg">
          Loading...
        </p>
      </>
    )

  // If id of univeristy not in database
  if ('message' in data)
    return (
      <>
        <div className="mt-16 flex w-full flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-destructive">404: Not Found</h2>
          <p>Could not find information about requested university</p>
          <Link href="/exchange" className="mt-5">
            <Button variant="secondary">Back to Exchange</Button>
          </Link>
        </div>
      </>
    )
  console.log(data)
  return (
    <>
      <InfoReviewsNav />

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-14">
        <UniInfoNav data={data} />
        <UniInfoMobileMenu data={data} />
        <UniInfoContent data={data} />
        <EditInfoButton />
      </div>
    </>
  )
}
