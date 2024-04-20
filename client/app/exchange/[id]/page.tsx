'use client'

import data from '@/lib/seed.json'
import { usePathname } from 'next/navigation'
import { toRomanNumerals } from '@/lib/utils'

export default function InfoPage() {
  const uniName: string = usePathname()
    .replace('/reviews', '')
    .replace('/exchange/', '')

  const uniData = data[uniName as keyof Object]

  return (
    <div className="pb-[2000px]">
      <div>
        {Object.entries(uniData).map(([key, value], index) => {
          if (key === 'webpage')
            return (
              <div
                key={index}
                className="mb-8 flex w-full items-center justify-center gap-2 font-medium lg:justify-normal"
              >
                <span className="text-lg text-primary">Official webpage:</span>{' '}
                <a
                  href={value}
                  target="_blank"
                  className="text-secondary-foreground underline underline-offset-2 hover:text-muted-foreground"
                >
                  {value}
                </a>
              </div>
            )

          return (
            <div
              key={index}
              id={key}
              className="mt-[-6rem] space-y-5 pb-8 pt-[6rem]"
            >
              <h3 className="text-xl font-bold text-foreground md:text-2xl">
                {`${toRomanNumerals(index)}. ${key[0].toUpperCase()}${key.substring(1)}`}
              </h3>
              <p className="font-medium text-secondary-foreground">{value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
