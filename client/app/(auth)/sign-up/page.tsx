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
import { createUser } from '@/lib/request'
import {
  registerFormSchema,
  type RegisterFormSchema,
} from '@/types/login-register'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()

  // Define form
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: 'test2',
      password: 'test2',
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
                    <Input placeholder="test2" {...field} />
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
                    <Input placeholder="KOR" {...field} />
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
                    <Input placeholder="skku" {...field} />
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
