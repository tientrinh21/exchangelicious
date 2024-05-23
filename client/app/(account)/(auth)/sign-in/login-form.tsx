'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authAtom } from '@/lib/auth'
import { fetchUser } from '@/lib/request'
import { loginFormSchema, type LoginFormSchema } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const setIsAuth = useSetAtom(authAtom)

  // Define form
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Submit handler
  async function onSubmit(values: LoginFormSchema) {
    const toastId = toast.loading('Signing in...')

    try {
      const user = await fetchUser(values)
      localStorage.setItem('user', btoa(JSON.stringify(user)))

      toast.success('All is good!', { id: toastId })
      setIsAuth(true)
      router.push('/exchange')
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg === 'User not found') toastMsg = 'This user does not exist!'
      else if (errMsg === 'Invalid credentials')
        toastMsg = 'The password is not correct!'

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
        <Button type="submit" className="mt-2 w-full">
          Login
        </Button>
      </form>
    </Form>
  )
}
