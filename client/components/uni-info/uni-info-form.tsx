'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateUniversityInfo } from '@/lib/request'
import { objKeyToText, toRomanNumerals } from '@/lib/utils'
import { uniInfoFormSchema, type UniInfoFormSchema } from '@/types/schema'
import type { UniversityInfo } from '@/types/university'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import UniInfoEditor from './uni-info-editor'
import { useRouter } from 'next/navigation'

export default function UniInfoForm({ data }: { data: UniversityInfo }) {
  const router = useRouter()

  // Define form
  const form = useForm<UniInfoFormSchema>({
    resolver: zodResolver(uniInfoFormSchema),
    defaultValues: {
      webpage: data.webpage ?? '',
      introduction: data.introduction ?? '',
      location: data.location ?? '',
      semester: data.semester ?? '',
      application_deadlines: data.application_deadlines ?? '',
      courses: data.courses ?? '',
      housing: data.housing ?? '',
      tuition: data.tuition ?? '',
      visa: data.visa ?? '',
      eligibility: data.eligibility ?? '',
      requirements: data.requirements ?? '',
    },
  })

  // Submit handler
  async function onSubmit(values: UniInfoFormSchema) {
    const toastId = toast.loading('Saving university information...')

    try {
      const newData = await updateUniversityInfo({
        id: data.info_page_id,
        values,
      })
      console.log(newData)
      toast.success('Saved!', { id: toastId })
      router.back()
      router.refresh()
    } catch (error: any) {
      const errMsg: string = error.response.data.message
      console.error(errMsg)

      let toastMsg = 'Something went wrong!'
      if (errMsg.includes('FOREIGN KEY')) toastMsg = 'The input is not valid.'

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
        className="flex w-full flex-col lg:order-1"
      >
        {Object.entries(data).map(([key, _], index) => {
          if (key == 'info_page_id') return
          if (key === 'webpage')
            return (
              <FormField
                key={index}
                control={form.control}
                name="webpage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="mb-4 mt-2 flex w-full items-center justify-center gap-2 font-medium lg:mb-8 lg:mt-0 lg:justify-normal">
                        <span className="font-semibold text-foreground sm:text-lg">
                          Webpage:
                        </span>{' '}
                        <Input
                          {...field}
                          placeholder="Webpage URL"
                          className="z-[100] text-primary underline underline-offset-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          return (
            <FormField
              key={index}
              control={form.control}
              name={key as keyof UniInfoFormSchema}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      id={key}
                      className="mt-[-6rem] space-y-5 pb-8 pt-[6rem]"
                    >
                      <h2 className="text-xl font-bold text-foreground md:text-2xl">
                        {`${toRomanNumerals(index)}. ${objKeyToText(key)}`}
                      </h2>
                      <UniInfoEditor
                        {...field}
                        placeholder={`Information about ${objKeyToText(key)}`}
                        index={index}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
        {/* Two update button, one for mobile, one for desktop */}
        <Button
          type="submit"
          className="fixed bottom-10 right-6 hidden md:flex"
        >
          <CheckIcon className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button
          type="submit"
          className="fixed bottom-8 right-4 sm:bottom-10 md:hidden"
          size="icon"
        >
          <CheckIcon />
        </Button>
      </form>
    </Form>
  )
}
