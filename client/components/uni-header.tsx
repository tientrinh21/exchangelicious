import { Skeleton } from '@/components/skeleton'
import React from 'react'

function UniHeaderName(props: { name: string }) {
  return (
    <h1 className="mb-2 text-xl font-bold text-primary-foreground sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:mb-6 lg:text-4xl">
      {props.name}
    </h1>
  )
}

function UniHeaderMeta(props: { meta: string }) {
  return (
    <span className="text-xs font-medium leading-5 text-primary-foreground sm:text-sm sm:leading-6 md:text-base md:leading-7">
      {props.meta}
    </span>
  )
}

function UniHeaderContainer(props: { children: React.ReactNode }) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col pb-6 lg:pb-8">
      {props.children}
    </div>
  )
}

function UniHeaderImgWrapper(props: {
  children: React.ReactNode
  imgSrc: string
}) {
  return (
    <div
      className="md:80 flex h-48 w-screen items-end justify-center bg-cover bg-center sm:h-72 lg:h-96"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.imgSrc})`,
      }}
    >
      {props.children}
    </div>
  )
}

function UniHeaderLoading() {
  return (
    <div className="md:80 flex h-48 w-screen items-end justify-center bg-secondary-foreground/75 bg-cover bg-center sm:h-72 lg:h-96">
      <UniHeaderContainer>
        <Skeleton className="mb-4 h-5 w-[250px] bg-background sm:mb-6 sm:h-8 md:h-10 md:w-[350px] lg:mb-8 lg:h-12 lg:w-[450px]" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px] lg:mb-3" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px] lg:mb-3" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px]" />
      </UniHeaderContainer>
    </div>
  )
}

export {
  UniHeaderContainer,
  UniHeaderImgWrapper,
  UniHeaderMeta,
  UniHeaderName,
  UniHeaderLoading,
}
