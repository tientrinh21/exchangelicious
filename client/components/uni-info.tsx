import { cn } from '@/lib/utils'
import React from 'react'

function UniInfoName(props: { name: string }) {
  return (
    <h2 className="mb-2 sm:mb-3 md:mb-4 lg:md-6 text-xl sm:text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
      {props.name}
    </h2>
  )
}

function UniInfoMeta(props: { meta: string }) {
  return (
    <span className=" text-xs leading-5 sm:text-sm sm:leading-6 md:text-base font-medium md:leading-7 text-primary-foreground">
      {props.meta}
    </span>
  )
}

function UniInfoContainer(props: { children: React.ReactNode }) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col pb-6 lg:pb-8">
      {props.children}
    </div>
  )
}

function UniInfoImgWrapper(props: {
  children: React.ReactNode
  imgSrc: string
}) {
  return (
    <div
      className='flex h-48 w-screen items-end justify-center bg-cover bg-center sm:h-72 md:80 lg:h-96'
      style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.imgSrc})` }}
    >
      {props.children}
    </div>
  )
}

export { UniInfoName, UniInfoMeta, UniInfoContainer, UniInfoImgWrapper }
