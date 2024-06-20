import { cn } from '@/lib/utils'
import { SymbolIcon } from '@radix-ui/react-icons'

export function LoadingSpinner({
  className,
  text,
}: {
  className?: string
  text?: string
}) {
  return (
    <>
      <div
        className={cn(
          'mt-4 flex w-full items-center justify-center gap-2 text-center',
          className,
        )}
      >
        <SymbolIcon className="h-4 w-4 animate-spin" />
        {text && (
          <p className="text-lg font-semibold text-secondary-foreground">
            {text}
          </p>
        )}
      </div>
    </>
  )
}
