import React from 'react'

export default function ExchangePage() {
  return (
    <div className="flex h-48 w-screen items-end justify-center bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('/skku.jpeg')] bg-cover sm:h-72 md:h-96">
      <div className="container flex w-full max-w-screen-lg flex-col pb-6">
        <UniName name="Sungkuynkwan University" />
        <UniMetaInfo info="Seoul, Suwon Campus" />
        <UniMetaInfo info="Republic of Korea" />
        <UniMetaInfo info="QS Ranking #171" />
      </div>
    </div>
  )
}

function UniName(props: { name: string }) {
  return (
    <h2 className="mb-4 text-lg font-bold text-primary-foreground md:text-3xl lg:text-4xl">
      {props.name}
    </h2>
  )
}

function UniMetaInfo(props: { info: string }) {
  return (
    <span className="text-base font-medium leading-7 text-primary-foreground">
      {props.info}
    </span>
  )
}
