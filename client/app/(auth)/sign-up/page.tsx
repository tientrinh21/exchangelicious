'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { useUniversities } from '@/lib/auth'
import countries from '@/lib/countries.json'
import { createUser } from '@/lib/request'
import { cn } from '@/lib/utils'
import {
  registerFormSchema,
  type RegisterFormSchema,
} from '@/types/login-register'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { CommandList } from 'cmdk'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const frequentlyCountries = [{ name: 'South Korea', code: 'KOR' }]
const frequentlyUniversities = [
  { long_name: 'Sungkyunkwan University', university_id: 'skku' },
]

export default function SignUpPage() {
  const router = useRouter()
  const [nationalityOpen, setNationalityOpen] = useState(false)
  const [nationalityValue, setNationalityValue] = useState('')

  const universities = useUniversities()
  const [uniOpen, setUniOpen] = useState(false)
  const [uniValue, setUniValue] = useState('')

  // Define form
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      password: '',
      nationality: '',
      home_university: '',
    },
  })

  // Submit handler
  async function onSubmit(values: RegisterFormSchema) {
    const toastId = toast.loading('Creating new account...')

    try {
      const user = await createUser(values)
      console.log(user)
      toast.success('Done! Please sign in.', { id: toastId })
      router.push('/sign-in')
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg.includes('Duplicate entry'))
        toastMsg = 'This user has already existed!'
      else if (errMsg.includes('FOREIGN KEY (`nationality`)'))
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
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

                  <Popover
                    open={nationalityOpen}
                    onOpenChange={setNationalityOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'flex w-full justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                            nationalityValue !== ''
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {nationalityValue
                            ? countries.find(
                                (country) => country.name === nationalityValue,
                              )?.name
                            : 'Select your country'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[80vw] max-w-[400px] p-0">
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
                                  onSelect={(currentValue) => {
                                    form.setValue(
                                      'nationality',
                                      currentValue === nationalityValue
                                        ? ''
                                        : country.code,
                                    )
                                    setNationalityValue(
                                      currentValue === nationalityValue
                                        ? ''
                                        : currentValue,
                                    )
                                    setNationalityOpen(false)
                                  }}
                                >
                                  {country.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      nationalityValue == country.name
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
                                  onSelect={(currentValue) => {
                                    form.setValue(
                                      'nationality',
                                      currentValue === nationalityValue
                                        ? ''
                                        : country.code,
                                    )
                                    setNationalityValue(
                                      currentValue === nationalityValue
                                        ? ''
                                        : currentValue,
                                    )
                                    setNationalityOpen(false)
                                  }}
                                >
                                  {country.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      nationalityValue == country.name
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
                            'flex w-full justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                            uniValue !== ''
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {uniValue
                            ? universities?.find(
                                (uni) => uni.long_name === uniValue,
                              )?.long_name
                            : 'Select your home university'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[80vw] max-w-[400px] p-0">
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
                                  onSelect={(currentValue) => {
                                    form.setValue(
                                      'home_university',
                                      currentValue === uniValue
                                        ? ''
                                        : uni.university_id,
                                    )
                                    setUniValue(
                                      currentValue === uniValue
                                        ? ''
                                        : currentValue,
                                    )
                                    setUniOpen(false)
                                  }}
                                >
                                  {uni.long_name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      uniValue == uni.long_name
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
                                  onSelect={(currentValue) => {
                                    form.setValue(
                                      'home_university',
                                      currentValue === uniValue
                                        ? ''
                                        : uni.university_id,
                                    )
                                    setUniValue(
                                      currentValue === uniValue
                                        ? ''
                                        : currentValue,
                                    )
                                    setUniOpen(false)
                                  }}
                                >
                                  {uni.long_name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      uniValue == uni.long_name
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
              Create an account
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="ml-1 text-base text-primary underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
