import Image from 'next/image'

export default function ReadySection() {
  return (
    <section className="relative">
      <div className="container flex w-full max-w-screen-lg flex-col items-center justify-between gap-8 pb-10 pt-32 lg:flex-row lg:pb-20">
        <div className="z-10 space-y-3">
          <h2 className="text-center text-3xl font-semibold text-foreground md:text-4xl lg:text-left">
            Make sure you are <span className="text-primary">ready</span>
          </h2>
          <p className="max-w-[450px] text-center font-medium text-secondary-foreground lg:text-left">
            Check evaluating factors such as courses, visa, expenses, housing,
            etc. and get ready for your new adventure
          </p>
        </div>
        <Image
          src="/ready.png"
          alt="Ready img"
          width={500}
          height={500}
          className="z-10 w-[400px]"
        />
      </div>

      <div className="absolute right-0 top-[15%] z-0 h-[60vh] w-[300px] rounded-l-full bg-gradient-to-l from-purple-100 blur-xl" />
    </section>
  )
}
