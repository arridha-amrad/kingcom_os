import ColorOptions from '@/components/ColorOptions'
import { cn } from '@/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { SlidingNumber } from '../motion-primitives/slide-number'
import Rating from '../Rating'

type Props = {
  data: {
    id: number
    name: string
    rating: number
    discount: number
    price: number
    description: string
    images: string[]
  }
}

export default function ProductDetailDescription({ data }: Props) {
  const [total, setTotal] = useState(1)

  const increase = () => {
    setTotal((val) => (val += 1))
  }

  const decrease = () => {
    setTotal((val) => {
      if (val === 1) return val
      return (val -= 1)
    })
  }

  const addToCart = () => {
    toast.success('Added')
  }

  return (
    <div className="flex-1 flex-grow min-h-full max-w-lg lg:max-w-3xl gap-4 flex justify-self-center flex-col justify-between">
      <h1
        title={data.name}
        className="font-header leading-12 tracking-wide font-bold line-clamp-2 text-[40px]"
      >
        {data.name}
      </h1>
      <Rating value={data.rating} />
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-3xl">
          ${data.price - (data.price * data.discount) / 100}
        </h1>
        <h1 className="font-bold text-3xl text-foreground/50">${data.price}</h1>
        <div className="w-[72px] h-[34px] rounded-full bg-[#ff3333]/10 flex items-center justify-center font-medium text-red-500">
          -{data.discount}%
        </div>
      </div>
      <p className="font-light">{data.description}</p>
      <div className="w-full h-px bg-foreground/10" />
      <h1 className="font-light">Select Colors</h1>
      <ColorOptions />
      <div className="w-full h-px bg-foreground/10" />
      <div className="flex items-center gap-4">
        <div className="flex-1 flex h-13 bg-foreground text-background  rounded-full">
          <button
            onClick={decrease}
            className={'size-13 pl-1 flex items-center justify-center'}
          >
            <svg
              width="20"
              height="4"
              viewBox="0 0 20 4"
              className={cn(
                total === 1 ? 'fill-background/50' : 'fill-background',
              )}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.375 2C19.375 2.29837 19.2565 2.58452 19.0455 2.79549C18.8345 3.00647 18.5484 3.125 18.25 3.125H1.75C1.45163 3.125 1.16548 3.00647 0.954505 2.79549C0.743526 2.58452 0.625 2.29837 0.625 2C0.625 1.70163 0.743526 1.41548 0.954505 1.2045C1.16548 0.993526 1.45163 0.875 1.75 0.875H18.25C18.5484 0.875 18.8345 0.993526 19.0455 1.2045C19.2565 1.41548 19.375 1.70163 19.375 2Z" />
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center">
            <SlidingNumber value={total} />
          </div>
          <button
            onClick={increase}
            className="flex pr-1 items-center justify-center size-13"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="fill-background"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.375 10C19.375 10.2984 19.2565 10.5845 19.0455 10.7955C18.8345 11.0065 18.5484 11.125 18.25 11.125H11.125V18.25C11.125 18.5484 11.0065 18.8345 10.7955 19.0455C10.5845 19.2565 10.2984 19.375 10 19.375C9.70163 19.375 9.41548 19.2565 9.2045 19.0455C8.99353 18.8345 8.875 18.5484 8.875 18.25V11.125H1.75C1.45163 11.125 1.16548 11.0065 0.954505 10.7955C0.743526 10.5845 0.625 10.2984 0.625 10C0.625 9.70163 0.743526 9.41548 0.954505 9.2045C1.16548 8.99353 1.45163 8.875 1.75 8.875H8.875V1.75C8.875 1.45163 8.99353 1.16548 9.2045 0.954505C9.41548 0.743526 9.70163 0.625 10 0.625C10.2984 0.625 10.5845 0.743526 10.7955 0.954505C11.0065 1.16548 11.125 1.45163 11.125 1.75V8.875H18.25C18.5484 8.875 18.8345 8.99353 19.0455 9.2045C19.2565 9.41548 19.375 9.70163 19.375 10Z" />
            </svg>
          </button>
        </div>
        <button
          onClick={addToCart}
          className="flex-2 h-13 bg-foreground text-background rounded-full"
        >
          Add To Cart
        </button>
      </div>
    </div>
  )
}
