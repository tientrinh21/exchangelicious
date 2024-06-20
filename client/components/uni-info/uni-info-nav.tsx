import { objKeyToText, toRomanNumerals } from '@/lib/utils'
import type { UniversityInfo } from '@/types/university'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function UniInfoNav(props: {
  data: UniversityInfo | undefined
}) {
  return (
    <div className="z-0 hidden w-[30%] min-w-44 lg:order-2 lg:block lg:min-w-52">
      <div className="sticky top-20 z-40">
        <ScrollArea className="mb-10 h-[80vh]">
          {Object.entries(props.data!).map(([key, _], index) => {
            if (key === 'info_page_id') return
            if (key === 'webpage') return
            return (
              <div
                key={index}
                className="w-full border-b-2 border-y-accent-foreground/30 py-4 first:border-t-2"
              >
                <Link
                  href={`#${key}`}
                  className="font-medium text-accent-foreground/75 hover:text-foreground"
                >
                  <span className="mr-1 inline-block w-8">{`${toRomanNumerals(index)}.`}</span>
                  <span>{objKeyToText(key)}</span>
                </Link>
              </div>
            )
          })}

          <div className="w-full border-b-2 border-y-accent-foreground/30 py-4 first:border-t-2">
            <Link
              href=""
              className="flex items-center font-medium text-accent-foreground/75 hover:text-foreground"
            >
              <ArrowUpIcon className="mr-4 inline-block h-5 w-5" />
              <span>Back to top</span>
            </Link>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
