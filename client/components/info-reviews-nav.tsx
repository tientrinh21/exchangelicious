'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function InfoReviewsNav({ uniId }: { uniId: string }) {
  return (
    <div className="gap flex">
      <InfoReviewsLink href={`/exchange/${uniId}`}>Information</InfoReviewsLink>
      <InfoReviewsLink href={`/exchange/${uniId}/reviews`}>
        Reviews
      </InfoReviewsLink>
    </div>
  )
}

function InfoReviewsLink(props: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <Link
      href={props.href}
      className={cn(
        'w-40 border-b-4 p-3 text-center text-base font-semibold hover:bg-secondary md:text-lg',
        pathname === props.href
          ? 'border-b-accent-foreground text-accent-foreground'
          : 'border-b-accent-foreground/40 text-accent-foreground/40',
      )}
    >
      <span>{props.children}</span>
    </Link>
  )
}
