'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function InfoReviewsNav() {
  const uniPathname = usePathname().replace('/reviews', '')

  return (
    <div className="gap flex">
      <InfoReviewsLink href={`${uniPathname}`}>Information</InfoReviewsLink>
      <InfoReviewsLink href={`${uniPathname}/reviews`}>Reviews</InfoReviewsLink>
    </div>
  )
}

function InfoReviewsLink(props: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <Link
      href={props.href}
      className={cn(
        'p-3 text-base font-semibold text-accent-foreground md:text-lg w-40 text-center border-b-4 border-b-accent-foreground',
        pathname === props.href ? 'opacity-100' : 'opacity-40',
      )}
    >
      <span>{props.children}</span>
    </Link>
  )
}
