'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { CommandList } from 'cmdk'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  frequentlyCountries,
  frequentlyUniversities,
  getUserData,
  useUniversities,
} from '@/lib/auth'
import countries from '@/lib/countries.json'
import { updateUser } from '@/lib/request'
import { cn } from '@/lib/utils'
import { profileFormSchema, type ProfileFormSchema } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function ProfileForm() {
  const [user, setUser] = useState(getUserData())

  const [nationalityOpen, setNationalityOpen] = useState(false)
  const [nationalityValue, setNationalityValue] = useState(
    user.nationality ?? '',
  )

  const universities = useUniversities()
  const [uniOpen, setUniOpen] = useState(false)
  const [uniValue, setUniValue] = useState(user.home_university ?? '')

  // Define form
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      password: '',
      nationality: user.nationality ?? '',
      home_university: user.home_university ?? '',
    },
  })

  // Submit handler
  async function onSubmit(values: ProfileFormSchema) {
    const toastId = toast.loading('Updating your account...')

    try {
      const updatedUser = await updateUser(user, values)
      localStorage.setItem('user', btoa(JSON.stringify(updatedUser)))
      setUser(updatedUser)
      console.log(updatedUser)

      form.setValue('password', '') // clean input on successful update
      toast.success('Updated successfullly!', { id: toastId })
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg.includes('FOREIGN KEY (`nationality`)'))
        toastMsg = 'The input country does not exist'
      else if (errMsg.includes('FOREIGN KEY (`home_university`)'))
        toastMsg = 'The input university does not exist'

      toast.error(toastMsg, {
        id: toastId,
        duration: 2000,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription></FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Nationality
                <span className="ml-2 text-xs">(Optional)</span>
              </FormLabel>

              <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'flex w-full max-w-[35rem] justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        nationalityValue !== ''
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {nationalityValue
                        ? countries.find(
                            (country) => country.code === nationalityValue,
                          )?.name
                        : 'Select your country'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[80vw] max-w-[35rem] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search country..."
                      className="h-9"
                    />
                    <ScrollArea className="h-[200px]">
                      <CommandGroup heading="Frequently">
                        <CommandList>
                          {frequentlyCountries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.name}
                              onSelect={() => {
                                const val =
                                  country.code === nationalityValue
                                    ? ''
                                    : country.code
                                form.setValue('nationality', val)
                                setNationalityValue(val)
                                setNationalityOpen(false)
                              }}
                            >
                              {country.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  nationalityValue == country.code
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                      <CommandGroup heading="All countries">
                        <CommandList>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.name}
                              onSelect={() => {
                                const val =
                                  country.code === nationalityValue
                                    ? ''
                                    : country.code
                                form.setValue('nationality', val)
                                setNationalityValue(val)
                                setNationalityOpen(false)
                              }}
                            >
                              {country.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  nationalityValue == country.code
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
        <FormField
          control={form.control}
          name="home_university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Home University
                <span className="ml-2 text-xs">(Optional)</span>
              </FormLabel>
              <Popover open={uniOpen} onOpenChange={setUniOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'flex w-full max-w-[35rem] justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        uniValue !== ''
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {uniValue
                        ? universities?.find(
                            (uni) => uni.university_id === uniValue,
                          )?.long_name
                        : 'Select your home university'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[80vw] max-w-[35rem] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search university..."
                      className="h-9"
                    />
                    <ScrollArea className="h-[200px]">
                      <CommandEmpty>No university found.</CommandEmpty>
                      <CommandGroup heading="Frequently">
                        <CommandList>
                          {frequentlyUniversities?.map((uni) => (
                            <CommandItem
                              key={uni.university_id}
                              value={uni.long_name}
                              onSelect={() => {
                                const val =
                                  uni.university_id === uniValue
                                    ? ''
                                    : uni.university_id
                                form.setValue('home_university', val)
                                setUniValue(val)
                                setUniOpen(false)
                              }}
                            >
                              {uni.long_name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  uniValue == uni.university_id
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                      <CommandGroup heading="All universities">
                        <CommandList>
                          {universities?.map((uni) => (
                            <CommandItem
                              key={uni.university_id}
                              value={uni.long_name}
                              onSelect={() => {
                                const val =
                                  uni.university_id === uniValue
                                    ? ''
                                    : uni.university_id
                                form.setValue('home_university', val)
                                setUniValue(val)
                                setUniOpen(false)
                              }}
                            >
                              {uni.long_name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  uniValue == uni.university_id
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
        <Button type="submit" className="mt-2 w-full">
          Update account
        </Button>
      </form>
    </Form>
  )
}
