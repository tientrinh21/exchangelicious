import { cn } from '@/lib/utils'
import React from 'react'

function UniInfoName(props: { name: string }) {
  return (
    <h2 className="mb-4 text-lg font-bold text-primary-foreground md:text-3xl lg:text-4xl">
      {props.name}
    </h2>
  )
}

function UniInfoMeta(props: { meta: string }) {
  return (
    <span className="text-base font-medium leading-7 text-primary-foreground">
      {props.meta}
    </span>
  )
}

function UniInfoContainer(props: { children: React.ReactNode }) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col pb-6">
      {props.children}
    </div>
  )
}

function UniInfoImgWrapper(props: {
  children: React.ReactNode
  imgSrc: string
}) {
  const bgImgUrl = `url('${props.imgSrc}')`

  return (
    <div
      className={cn(
        'flex h-48 w-screen items-end justify-center bg-cover sm:h-72 md:h-96',
        `bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),${bgImgUrl}]`,
      )}
    >
      {props.children}
    </div>
  )
}

export { UniInfoName, UniInfoMeta, UniInfoContainer, UniInfoImgWrapper }
