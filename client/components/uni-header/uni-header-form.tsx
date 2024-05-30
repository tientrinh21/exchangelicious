'use client'

import { Button } from '@/components/ui/button'
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
import { updateUniversity } from '@/lib/request'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { University } from '@/types/university'
import { uniHeaderFormSchema, type UniHeaderFormSchema } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'

export default function UniHeaderForm(data: University) {
  // Define form
  const form = useForm<UniHeaderFormSchema>({
    resolver: zodResolver(uniHeaderFormSchema),
    defaultValues: {
      long_name: '',
      country_code: '',
      region: '',
      campus: '',
      ranking: '',
      housing: '',
    },
  })

  return (
    <div>Test</div>
  )
}