import React from 'react'

export default function UniHeaderImgWrapper(props: {
  children: React.ReactNode
  universityId: string
}) {
  const imgSrc = `/${props.universityId}.png`
  const fallbackImgSrc = `/fallback-uni-${Math.floor(Math.random() * 3) + 1}.png`

  return (
    <div
      className="md:80 flex h-48 w-full items-end justify-center bg-cover bg-center sm:h-72 lg:h-96"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgSrc}), url(${fallbackImgSrc})`,
      }}
    >
      {props.children}
    </div>
  )
}
