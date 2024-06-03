import { objKeyToText, toRomanNumerals } from '@/lib/utils'
import type { UniversityInfo } from '@/types/university'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function UniInfoContent(props: {
  data: UniversityInfo | undefined
}) {
  return (
    <div className="w-full lg:order-1">
      {Object.entries(props.data!).map(([key, value], index) => {
        if (key === 'webpage')
          return (
            <div
              key={index}
              className="mb-4 mt-2 w-full items-center gap-2 text-center font-medium lg:mb-8 lg:mt-0 lg:text-left"
            >
              <span className="font-semibold text-foreground sm:text-lg">
                Webpage:
              </span>{' '}
              <Link
                href={value}
                target="_blank"
                className="break-words text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {value}
              </Link>
            </div>
          )

        return (
          <div
            key={index}
            id={key}
            className="mt-[-6rem] space-y-5 pb-8 pt-[6rem]"
          >
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              {`${toRomanNumerals(index)}. ${objKeyToText(key)}`}
            </h2>
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="prose max-w-none font-medium text-secondary-foreground"
              components={{
                a: ({ node, href, ...props }) => (
                  <Link
                    {...props}
                    href={href as Url}
                    target="_blank"
                    className="break-words text-primary underline underline-offset-4 hover:text-primary/80"
                  />
                ),
              }}
            >
              {value ? value : 'No information provided yet.'}
            </Markdown>
          </div>
        )
      })}
    </div>
  )
}
