import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { objKeyToText, toRomanNumerals } from '@/lib/utils'
import type { Error } from '@/types/error'
import type { UniversityInfo } from '@/types/university'
import {
  DotsHorizontalIcon,
  SymbolIcon,
  ArrowUpIcon,
} from '@radix-ui/react-icons'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkIns from 'remark-ins'

function UniInfoContent(props: { data: UniversityInfo | undefined }) {
  return (
    <div className="lg:order-1">
      {Object.entries(props.data!).map(([key, value], index) => {
        if (key === 'info_page_id') return

        if (key === 'webpage')
          return (
            <div
              key={index}
              className="mb-4 mt-2 flex w-full items-center justify-center gap-2 font-medium lg:mb-8 lg:mt-0 lg:justify-normal"
            >
              <span className="font-semibold text-foreground sm:text-lg">
                Webpage:
              </span>{' '}
              <Link
                href={value}
                target="_blank"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
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
            {/* <p className="whitespace-pre-line font-medium text-secondary-foreground"> */}
            {/*   {value} */}
            {/* </p> */}
            <Markdown
              remarkPlugins={[remarkGfm, remarkIns]}
              className="prose font-medium text-secondary-foreground"
              components={{
                a: ({ node, href, ...props }) => (
                  <Link
                    {...props}
                    href={href as Url}
                    target="_blank"
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  />
                ),
              }}
            >
              {value}
            </Markdown>
          </div>
        )
      })}
    </div>
  )
}

function UniInfoNav(props: { data: UniversityInfo | undefined }) {
  return (
    <div className="hidden w-[30%] min-w-44 lg:order-2 lg:block lg:min-w-52">
      <div className="sticky top-20 z-40">
        {Object.entries(props.data!).map(([key, _], index) => {
          if (key === 'webpage' || key === 'info_page_id') return
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
      </div>
    </div>
  )
}

function UniInfoMobileMenu(props: { data: UniversityInfo | undefined }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="sticky top-20 mx-auto flex w-1/3 justify-center rounded-lg bg-background lg:hidden">
          <Button
            variant="outline"
            className="w-full bg-muted-foreground/15 text-foreground/65"
          >
            <DotsHorizontalIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="sr-only">Dots Menu</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[65vw] space-y-2 rounded-lg px-4 py-4 shadow-xl sm:w-[40vw]"
      >
        {Object.entries(props.data!).map(([key, _], index) => {
          if (key === 'webpage') return
          return (
            <DropdownMenuItem key={index}>
              <Link
                href={`#${key}`}
                className={`mx-auto w-2/3 text-base font-medium text-accent-foreground`}
              >
                <span className="mr-1 inline-block w-8">{`${toRomanNumerals(index)}.`}</span>
                <span>{objKeyToText(key)}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuItem>
          <Link
            href=""
            className={`mx-auto w-2/3 text-base font-medium text-accent-foreground`}
          >
            <ArrowUpIcon className="mr-4 inline-block h-5 w-5" />
            <span>Back to top</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UniInfoLoading() {
  return (
    <>
      <div className="mt-4 flex w-full items-center justify-center gap-2 text-center">
        <SymbolIcon className="h-4 w-4 animate-spin" />
        <p className="text-xl font-medium text-secondary-foreground">
          Loading...
        </p>
      </div>
    </>
  )
}

function UniInfoError(props: { error: Error }) {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center text-center">
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
    </>
  )
}

export {
  UniInfoContent,
  UniInfoError,
  UniInfoLoading,
  UniInfoMobileMenu,
  UniInfoNav,
}
