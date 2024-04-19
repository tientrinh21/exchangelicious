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

export { UniInfoName, UniInfoMeta }