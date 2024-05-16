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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BASE_URL } from '@/lib/utils'
import { type User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { headers } from 'next/headers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Form schema
const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be 2 or more characters long' })
    .max(50),
  password: z
    .string()
    .min(2, { message: 'Password must be 2 or more characters long' })
    .max(50),
  nationality: z.string().optional(),
  home_university: z.string().optional(),
})
type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function SignUpPage() {
  const router = useRouter()

  // Define form
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function createUser({
    username,
    password,
    nationality,
    home_university,
  }: RegisterFormSchema) {
    return axios
      .post<User>(`${BASE_URL}/users`, null, {
        params: {
          username: username,
          pwd: password,
          nationality: nationality,
          home_university: home_university,
        },
      })
      .then((r) => r.data)
  }

  // Submit handler
  async function onSubmit(values: RegisterFormSchema) {
    try {
      console.log('Creating account with username:', values.username)
      console.log(values)
      const user = await createUser(values)
      console.log(user)
      // router.push('/sign-in')
    } catch (error) {
      console.error(error)
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
                    <Input placeholder="test" {...field} />
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
                <FormItem>
                  <FormLabel>
                    Nationality
                    <span className="ml-2 text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2 w-full">
              Create an account
            </Button>
          </form>
        </Form>
        {/* <div className="grid gap-4"> */}
        {/*   <div className="grid gap-2"> */}
        {/*     <Label htmlFor="username">Username</Label> */}
        {/*     <Input id="username" required /> */}
        {/*   </div> */}
        {/*   <div className="grid gap-2"> */}
        {/*     <Label htmlFor="password">Password</Label> */}
        {/*     <Input id="password" type="password" /> */}
        {/*   </div> */}
        {/*   <div className="grid gap-2"> */}
        {/*     <Label htmlFor="nationality">Nationality</Label> */}
        {/*     <Input id="nationality" placeholder="South Korea" required /> */}
        {/*   </div> */}
        {/*   <div className="grid gap-2"> */}
        {/*     <Label htmlFor="home_university">Home University</Label> */}
        {/*     <Input */}
        {/*       id="home_university" */}
        {/*       placeholder="Sungkyunkwan University" */}
        {/*       required */}
        {/*     /> */}
        {/*   </div> */}
        {/*   <Button type="submit" className="mt-2 w-full"> */}
        {/*     Create an account */}
        {/*   </Button> */}
        {/* </div> */}
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
