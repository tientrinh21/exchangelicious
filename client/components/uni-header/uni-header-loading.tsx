import { Skeleton } from '@/components/skeleton'
import UniHeaderContainer from './uni-header-container'

export default function UniHeaderLoading() {
  return (
    <div className="md:80 flex h-48 w-screen items-end justify-center bg-secondary-foreground/75 bg-cover bg-center sm:h-72 lg:h-96">
      <UniHeaderContainer>
        <Skeleton className="mb-4 h-5 w-[250px] bg-background sm:mb-6 sm:h-8 md:h-10 md:w-[350px] lg:mb-8 lg:h-12 lg:w-[450px]" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px] lg:mb-3" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px] lg:mb-3" />
        <Skeleton className="mb-1 h-3 w-[100px] bg-background md:mb-2 md:h-4 md:w-[150px]" />
      </UniHeaderContainer>
    </div>
  )
}
