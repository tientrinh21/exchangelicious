import React from 'react'

export default function UniHeaderContainer(props: { children: React.ReactNode }) {
  return (
    <div className="container flex w-full max-w-screen-lg flex-col pb-6 lg:pb-8">
      {props.children}
    </div>
  )
}
