import React from 'react'

export default function UniHeaderContainer(props: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col px-4 pb-6 md:px-6 lg:px-8 lg:pb-8">
      {props.children}
    </div>
  )
}
