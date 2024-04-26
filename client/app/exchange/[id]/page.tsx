'use client'

import { InfoReviewsNav } from '@/components/info-reviews-nav'
import {
  UniInfoContent,
  UniInfoMobileMenu,
  UniInfoNav,
} from '@/components/uni-info'
import testData from '@/lib/seed.json'
import { usePathname } from 'next/navigation'
import { EditInfoButton } from '@/components/edit-button'
import useSWR, { Fetcher } from 'swr'
import { useState, useEffect } from 'react'

const BASE_URL = 'http://localhost:8080/api'
// const BASE_URL = 'humble-space-umbrella-6556vx4xvxq34g45-8080.app.github.dev/api/'

const fetcher = (pathname: string) =>
  fetch(`${BASE_URL}${pathname}`).then((res) => res.json())

// const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function InfoPage() {
  // TODO: To be change soon
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const uniData = testData[uniName as keyof Object]
  // const { data, error, isLoading } = useSWR(
  //   `${BASE_URL}/universities/${uniName}/info`,
  //   fetcher,
  // )

  // if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false) // to avoid blank screen when awaiting
  const [users, setUsers] = useState([])

  // GET request
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      // Error handling
      try {
        // Call the api and cast the response via json
        const response = await fetch(`${BASE_URL}/universities/${uniName}/info`)
        const users = await response.json()
        console.log(response)
        setUsers(users)
        // We should probably handle this better
      } catch (error: any) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // display error
  if (error) {
    return <div>Error</div>
  }

  console.log(users)

  return (
    <>
      <InfoReviewsNav />

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-14">
        <UniInfoNav data={uniData} />
        <UniInfoMobileMenu data={uniData} />
        <UniInfoContent data={uniData} />
        <EditInfoButton />
      </div>
    </>
  )
}
