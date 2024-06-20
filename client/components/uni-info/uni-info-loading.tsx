import { SymbolIcon } from '@radix-ui/react-icons'

export default function UniInfoLoading() {
  return (
    <>
      <div className="mt-4 flex w-full items-center justify-center gap-2 text-center">
        <SymbolIcon className="h-4 w-4 animate-spin" />
        <p className="text-xl font-medium text-secondary-foreground">
          Loading...
        </p>
      </div>
    </>
  )
}
