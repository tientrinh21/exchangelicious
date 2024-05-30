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
import { updateUser } from '@/lib/request'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { University, UniversityInfo } from '@/types/university'

export default function UniHeaderForm() {
  return (
    <div>Test</div>
  )
}