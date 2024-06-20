export default function UniHeaderName(props: { name: string }) {
  return (
    <h1 className="mb-2 text-xl font-bold text-primary-foreground sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:mb-6 lg:text-4xl">
      {props.name}
    </h1>
  )
}