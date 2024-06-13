import React from 'react'

export default function UniHeaderContainer(props: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col p-3 sm:p-4 md:p-6 lg:p-8">
      {props.children}
    </div>
  )
}
