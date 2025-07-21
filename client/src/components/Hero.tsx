import Logo from '@/assets/images/kingkom.png'
import { useRef } from 'react'

function HomeHero() {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <section
      className="relative flex py-8 items-center justify-center flex-1 h-full  w-full"
      id="hero"
    >
      <div
        ref={ref}
        className="relative flex flex-col gap-6 h-full items-center xl:p-0 px-4 justify-center"
      >
        <div className="max-w-xl space-y-6 relative">
          <h1 className="uppercase font-header text-6xl">
            GET THE WORKSPACE THAT MATCHES YOUR STYLE
          </h1>
          <p>
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <button className="w-[210px] h-[52px] rounded-full bg-foreground text-background">
            Shop Now
          </button>
          <div className="xl:flex hidden xl:items-center items-start relative justify-start gap-6">
            <div className="">
              <h1 className="font-bold text-xl xl:text-4xl">200+</h1>
              <p className="text-sm xl:text-base">International Brands</p>
            </div>
            <div className="bg-black/10 w-px h-full relative" />
            <div className="">
              <h1 className="font-bold text-xl xl:text-4xl">2,000+</h1>
              <p className="text-sm xl:text-base">High-quality Products</p>
            </div>
            <div className="bg-black/10 w-px h-full relative" />
            <div className="">
              <h1 className="font-bold text-xl xl:text-4xl">30,000+</h1>
              <p className="text-sm xl:text-base">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 500 }} className="aspect-square xl:block hidden">
        <img
          width={500}
          height={500}
          className="object-cover aspect-square"
          src={Logo}
          alt="Logo"
        />
      </div>
    </section>
  )
}

export default HomeHero
