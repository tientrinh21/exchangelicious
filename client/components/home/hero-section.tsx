import Image from 'next/image'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative mt-12 flex w-full flex-col items-center gap-8 bg-gradient-to-t from-sky-200 via-sky-200/60 via-70% px-4 py-10 md:gap-10">
      <div className="z-10 flex flex-col items-center gap-2 md:gap-4">
        <h1 className="text-center text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          {siteConfig.slogan}
        </h1>
        <div className="z-10 space-x-1">
          <Link href="/sign-in">
            <Button className="md:h-10 md:w-32 md:text-xl">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary" className="md:h-10 md:w-32 md:text-xl">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
      <Image
        src={siteConfig.heroImg}
        width={500}
        height={500}
        className="z-10 w-[400px] md:w-[500px]"
        alt="Hero img"
      />

      <div className="absolute bottom-0 left-0 z-0 h-[450px] w-[50vw] rounded-tr-full bg-gradient-to-tr from-teal-100 blur-lg" />
      <div className="absolute bottom-0 right-0 z-0 h-[450px] w-[50vw] rounded-tl-full bg-gradient-to-tr from-teal-100 blur-lg" />
    </section>
  )
}
