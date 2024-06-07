'use client'

import { getUserData, isAuthenticated } from '@/lib/auth'
import { createReview } from '@/lib/request'
import { cn } from '@/lib/utils'
import { MoodScore } from '@/types/review-section'
import { type ReviewFormSchema, reviewFormSchema } from '@/types/schema'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const moods = Object.values(MoodScore)

export function CreateReviewForm({ university_id }: { university_id: string }) {
  const router = useRouter()

  // TODO: Fix cannot use useAuth because its parent is RSC
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    setIsAuth(isAuthenticated())
    const user = getUserData()
    setUser(user)
  }, [typeof window !== 'undefined'])

  // Define form
  const form = useForm<ReviewFormSchema>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: '',
      content: '',
      mood_score: '',
    },
  })

  // Submit handler
  async function onSubmit(values: ReviewFormSchema) {
    const toastId = toast.loading('Creating review...')

    try {
      const review = await createReview({
        user_id: user!.user_id,
        university_id,
        values,
      })
      console.log(review)
      toast.success('Created successfully!', { id: toastId })
      router.refresh()
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      // TODO: handle more exceptions
      let toastMsg = 'Something went wrong!'

      toast.error(toastMsg, {
        id: toastId,
        duration: 2000,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('font-medium', !isAuth && 'hidden')}
      >
        <div className="flex w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Title"
                    className="h-9 text-base placeholder:text-muted"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Done</Button>
        </div>
      </form>
    </Form>
  )
}
