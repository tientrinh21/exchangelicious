'use client'

import {
  AutosizeTextAreaRef,
  AutosizeTextarea,
} from '@/components/ui/autosize-textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkIns from 'remark-ins'

type UniInfoEditorProps = {
  index?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

type MarkdownValue = string | null | undefined

export const MarkdownEditor = React.forwardRef<
  AutosizeTextAreaRef,
  UniInfoEditorProps
>(({ className, value, index, ...props }, ref) => {
  return (
    <Tabs
      defaultValue="editor"
      // Smaller index will stay on top, prevent overlap of next field because of `mt-[-6rem] pt-[6rem] in parent's <div>
      className={cn('relative', index && `z-[${100 - index}]`)}
    >
      <TabsList className="absolute right-5 top-[-1.25rem] bg-secondary">
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="editor">
        <AutosizeTextarea
          {...props}
          className={cn(
            'prose max-w-none px-5 pb-5 pt-6 text-base font-medium text-secondary-foreground',
            className,
          )}
          ref={ref}
          value={value}
        />
      </TabsContent>
      <TabsContent value="preview">
        <Markdown
          remarkPlugins={[remarkGfm, remarkIns]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          className="prose max-w-none rounded-md border border-input px-5 pb-4 pt-6 font-medium text-secondary-foreground"
          components={{
            a: ({ node, href, ...props }) => (
              <Link
                {...props}
                href={href as Url}
                target="_blank"
                className="break-words text-primary underline underline-offset-4 hover:text-primary/80"
              />
            ),
          }}
        >
          {value ? (value as MarkdownValue) : 'Nothing to preview'}
        </Markdown>
      </TabsContent>
    </Tabs>
  )
})
