import React from 'react'

export default function UniHeaderImgWrapper(props: {
  children: React.ReactNode
  imgSrc: string
}) {
  const fallbackImgSrc = '/fallback-uni.jpg'

  return (
    <div
      className="md:80 flex h-48 w-screen items-end justify-center bg-cover bg-center sm:h-72 lg:h-96"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.imgSrc}), url(${fallbackImgSrc})`,
      }}
    >
      {props.children}
    </div>
  )
}
