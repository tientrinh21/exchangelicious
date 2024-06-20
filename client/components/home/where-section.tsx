import Image from 'next/image'

export default function WhereSection() {
  return (
    <section className="relative">
      <div className="container flex w-full max-w-screen-lg flex-col items-center justify-between gap-8 pt-32 lg:flex-row">
        <div className="z-10 space-y-3 lg:order-2">
          <h2 className="text-center text-3xl font-semibold text-foreground md:text-4xl lg:text-left ">
            Check <span className="text-primary">where</span> you can go
          </h2>
          <p className="max-w-[450px] text-center font-medium text-secondary-foreground lg:text-left">
            Check universities around the world where your home university
            partnershiped with
          </p>
        </div>
        <Image
          src="/where.png"
          alt="Where img"
          width={500}
          height={500}
          className="z-10 w-[400px] lg:order-1"
        />
      </div>

      <div className="absolute left-0 top-[15%] z-0 h-[60vh] w-[300px] rounded-r-full bg-gradient-to-r from-orange-100/80 blur-xl" />
    </section>
  )
}
