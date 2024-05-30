export default function UniHeaderMeta(props: { meta: string }) {
  return (
    <span className="text-xs font-medium leading-5 text-primary-foreground sm:text-sm sm:leading-6 md:text-base md:leading-7">
      {props.meta}
    </span>
  )
}
