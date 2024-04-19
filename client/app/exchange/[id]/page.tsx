import { UniInfoName, UniInfoMeta } from '@/components/uni-info'

export default function ExchangePage() {
  return (
    <div className="flex h-48 w-screen items-end justify-center bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('/skku.jpeg')] bg-cover sm:h-72 md:h-96">
      <div className="container flex w-full max-w-screen-lg flex-col pb-6">
        <UniInfoName name="Sungkuynkwan University" />
        <UniInfoMeta meta="Seoul, Suwon Campus" />
        <UniInfoMeta meta="Republic of Korea" />
        <UniInfoMeta meta="QS Ranking #171" />
      </div>
    </div>
  )
}
