'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from '@/components/ui/autosize-textarea'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Url } from 'next/dist/shared/lib/router/router'
import { cn } from '@/lib/utils'

type UniInfoEditorProps = {
  index?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

type MarkdownValue = string | null | undefined

const UniInfoEditor = React.forwardRef<AutosizeTextAreaRef, UniInfoEditorProps>(
  ({ className, value, index, ...props }, ref) => {
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
            className="prose max-w-none px-5 pb-4 pt-6 text-base font-medium text-secondary-foreground"
            ref={ref}
            value={value}
          />
        </TabsContent>
        <TabsContent value="preview">
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="prose max-w-none rounded-md border border-input px-5 pb-4 pt-6 font-medium text-secondary-foreground"
            components={{
              a: ({ node, href, ...props }) => (
                <Link
                  {...props}
                  href={href as Url}
                  target="_blank"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                />
              ),
            }}
          >
            {value ? (value as MarkdownValue) : 'Nothing to preview'}
          </Markdown>
        </TabsContent>
      </Tabs>
    )
  },
)

export default UniInfoEditor
