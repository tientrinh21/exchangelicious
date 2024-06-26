'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import countries from '@/lib/countries.json'
import { updateUniversity } from '@/lib/request'
import { cn } from '@/lib/utils'
import { uniHeaderFormSchema, type UniHeaderFormSchema } from '@/types/schema'
import {
  Campus,
  Housing,
  campusText,
  type University,
} from '@/types/university'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon, UpdateIcon } from '@radix-ui/react-icons'
import { CommandList } from 'cmdk'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const housingOptions = Object.values(Housing)
const campusOptions = Object.values(Campus)

export default function UniHeaderForm({ data }: { data: University }) {
  const [countryOpen, setCountryOpen] = useState(false)
  const [countryValue, setCountryValue] = useState(data.country_code)

  const [housingOpen, setHousingOpen] = useState(false)
  const [housingValue, setHousingValue] = useState(data.housing)

  const [campusOpen, setCampusOpen] = useState(false)
  const [campusValue, setCampusValue] = useState(data.campus)

  // Define form
  const form = useForm<UniHeaderFormSchema>({
    resolver: zodResolver(uniHeaderFormSchema),
    defaultValues: {
      long_name: data.long_name ?? '',
      country_code: data.country_code ?? '',
      region: data.region ?? '',
      campus: data.campus,
      ranking: data.ranking ?? '',
      housing: data.housing,
    },
  })

  // Submit handler
  async function onSubmit(values: UniHeaderFormSchema) {
    const toastId = toast.loading('Updating university header...')

    try {
      await updateUniversity({ id: data.university_id, values })
      toast.success('Updated successfully!', { id: toastId })
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg.includes('FOREIGN KEY (`country_code`)'))
        toastMsg = 'The input country does not exist'

      toast.error(toastMsg, { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative grid gap-1 md:gap-2"
      >
        <FormField
          control={form.control}
          name="long_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="University name"
                  className="h-9 text-base font-bold text-primary-foreground placeholder:text-muted sm:text-lg md:h-12 md:text-xl lg:text-2xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campus"
          render={() => (
            <FormItem>
              <FormControl>
                <Popover open={campusOpen} onOpenChange={setCampusOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'flex h-7 w-full max-w-[19.75rem] justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:min-w-48 sm:text-sm md:max-w-[22rem] md:text-base',
                          campusValue !== Campus.nan
                            ? 'text-primary-foreground'
                            : 'text-muted',
                        )}
                      >
                        {campusValue
                          ? campusText[
                              campusOptions.find(
                                (option) => option === campusValue,
                              )!
                            ]
                          : 'Select campus option'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="z-[200] w-[80vw] max-w-[19.75rem] p-0 md:max-w-[22rem]">
                    <Command>
                      <CommandGroup>
                        <CommandList>
                          {campusOptions.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={() => {
                                const val = option
                                form.setValue('campus', val)
                                setCampusValue(val)
                                setCampusOpen(false)
                              }}
                            >
                              {campusText[option]}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  campusValue === option
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Region"
                    className="h-7 min-w-52 text-xs font-medium leading-5 text-primary-foreground placeholder:text-muted sm:min-w-[22rem] sm:text-sm sm:leading-6 md:text-base md:leading-7"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="mx-2 text-primary-foreground">-</span>
          <FormField
            control={form.control}
            name="country_code"
            render={() => (
              <FormItem className="flex flex-col">
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'flex h-7 w-full max-w-64 justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:min-w-48 sm:text-sm md:text-base',
                          countryValue !== ''
                            ? 'text-primary-foreground'
                            : 'text-muted',
                        )}
                      >
                        {countryValue
                          ? countries.find(
                              (country) => country.code === countryValue,
                            )?.name
                          : 'Select your country'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="z-[200] w-[80vw] max-w-64 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <ScrollArea className="h-[200px]">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {countries.map((country) => (
                              <CommandItem
                                key={country.code}
                                value={country.name}
                                onSelect={() => {
                                  const val =
                                    country.code === countryValue
                                      ? ''
                                      : country.code
                                  form.setValue('country_code', val)
                                  setCountryValue(val)
                                  setCountryOpen(false)
                                }}
                              >
                                {country.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    countryValue === country.code
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="ranking"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <span className="min-w-24 text-sm font-medium text-primary-foreground sm:text-sm md:text-base">
                    World Rank:
                  </span>
                  <Input
                    placeholder="Ranking"
                    className="h-7 max-w-64 text-xs font-medium leading-5 text-primary-foreground placeholder:text-muted sm:text-sm sm:leading-6 md:text-base md:leading-7"
                    disabled
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="housing"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <span className="min-w-24 text-sm font-medium text-primary-foreground sm:text-sm md:text-base">
                    Housing:
                  </span>
                  <Popover open={housingOpen} onOpenChange={setHousingOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'flex h-7 w-full max-w-64 justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:min-w-48 sm:text-sm md:text-base',
                            housingValue !== Housing.nan
                              ? 'text-primary-foreground'
                              : 'text-muted',
                          )}
                        >
                          {housingValue
                            ? housingOptions.find(
                                (option) => option === housingValue,
                              )
                            : 'Select housing option'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="z-[200] w-[80vw] max-w-64 p-0">
                      <Command>
                        <CommandGroup>
                          <CommandList>
                            {housingOptions.map((option) => (
                              <CommandItem
                                key={option}
                                value={option}
                                onSelect={() => {
                                  const val = option
                                  form.setValue('housing', val)
                                  setHousingValue(val)
                                  setHousingOpen(false)
                                }}
                              >
                                {option}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    housingValue === option
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Two update button, one for mobile, one for desktop */}
        <Button
          type="submit"
          className="absolute bottom-[-40px] right-0 hidden border-primary md:flex"
        >
          <UpdateIcon className="mr-2 h-4 w-4" />
          Update
        </Button>
        <Button
          type="submit"
          className="absolute bottom-[-40px] right-0 md:hidden"
          size="icon"
        >
          <UpdateIcon />
        </Button>
      </form>
    </Form>
  )
}
