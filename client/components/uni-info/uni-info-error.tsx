import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UniInfoError(props: { error: Error }) {
  return (
    <div className="absolute left-0 top-1/2 flex w-full flex-col items-center justify-center text-center md:top-2/3">
      <h1 className="text-xl font-bold text-destructive">404: Not Found</h1>
      <p>
        {/* If id of univeristy not in database */}
        {props.error.message.includes('No university with the ID')
          ? 'Could not find information about requested university'
          : 'An error occurred while fetching the data.'}
      </p>
      <Link href="/exchange" className="mt-5">
        <Button variant="secondary">Back to Exchange</Button>
      </Link>
    </div>
  )
}
