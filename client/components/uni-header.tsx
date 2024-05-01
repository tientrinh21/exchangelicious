import React from 'react'

function UniHeaderName(props: { name: string }) {
  return (
    <h2 className="mb-2 text-xl font-bold text-primary-foreground sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:mb-6 lg:text-4xl">
      {props.name}
    </h2>
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

export { UniHeaderContainer, UniHeaderImgWrapper, UniHeaderMeta, UniHeaderName }
