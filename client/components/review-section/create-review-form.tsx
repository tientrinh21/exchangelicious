'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MarkdownEditor } from '@/components/ui/markdown-editor'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useUser } from '@/lib/auth'
import { createReview } from '@/lib/request'
import { cn, displayMood, moods } from '@/lib/utils'
import { MoodScore } from '@/types/review'
import { reviewFormSchema, type ReviewFormSchema } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { atomReloadReviews } from './review-section'

export function CreateReviewForm({ university_id }: { university_id: string }) {
  const [moodOpen, setMoodOpen] = useState(false)
  const [moodValue, setMoodValue] = useState('')

  const setReloadReviews = useSetAtom(atomReloadReviews)

  const user = useUser()

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
      await createReview({
        user_id: user!.user_id,
        university_id,
        values,
      })
      toast.success('Created successfully!', { id: toastId })
      setReloadReviews(true)
      form.reset()
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      toast.error(toastMsg, { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'grid w-full grid-cols-1 gap-y-2 font-medium sm:grid-cols-[1fr_max-content_max-content] sm:gap-x-1',
          !user && 'hidden',
        )}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-1">
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
        <FormField
          control={form.control}
          name="mood_score"
          render={() => (
            <FormItem>
              <FormControl>
                <Popover open={moodOpen} onOpenChange={setMoodOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'flex h-9 w-full min-w-40 justify-between px-3 text-base placeholder:text-muted',
                          moodValue ? 'text-base' : 'text-muted',
                        )}
                      >
                        {moodValue
                          ? displayMood(moodValue as MoodScore)
                          : 'Mood'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="z-[200] w-[85vw] p-0 sm:max-w-40">
                    <Command>
                      <CommandGroup>
                        <CommandList>
                          {moods.map((mood) => (
                            <CommandItem
                              key={mood}
                              value={mood}
                              onSelect={() => {
                                const val = mood === moodValue ? '' : mood
                                form.setValue('mood_score', val)
                                setMoodValue(val)
                                setMoodOpen(false)
                              }}
                            >
                              {displayMood(mood)}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  moodValue == mood
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
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-3 mt-3">
              <FormControl>
                <MarkdownEditor
                  placeholder="Content"
                  className="px-3 text-base placeholder:text-muted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="col-span-3 sm:col-span-1 sm:col-start-3 sm:row-start-1"
        >
          <CheckIcon className="mr-2 h-4 w-4" />
          Done
        </Button>
      </form>
    </Form>
  )
}
