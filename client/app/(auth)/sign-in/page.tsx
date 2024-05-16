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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Form schema
const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be 2 or more characters long' })
    .max(50),
  password: z
    .string()
    .min(2, { message: 'Password must be 2 or more characters long' })
    .max(50),
})
type LoginFormSchema = z.infer<typeof loginFormSchema>

export default function SignInPage() {
  const router = useRouter()

  // Define form
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: 'test',
      password: 'test',
    },
  })

  async function fetchUser({ username, password }: LoginFormSchema) {
    return axios
      .get<User>(`${BASE_URL}/users`, {
        params: {
          username: username,
          pwd: password,
        },
      })
      .then((r) => r.data)
  }

  // Submit handler
  async function onSubmit(values: LoginFormSchema) {
    try {
      console.log('Logging in with username:', values.username)
      const user = await fetchUser(values)
      console.log(user)

      localStorage.setItem('user', JSON.stringify(user))
      // localStorage.setItem('user', btoa(JSON.stringify(user)))
      router.push('/exchange')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
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
            <Button type="submit" className="mt-2 w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="ml-1 text-base text-primary underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
