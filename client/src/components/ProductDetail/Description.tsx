import ColorOptions from '@/components/ColorOptions';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { SlidingNumber } from '../motion-primitives/slide-number';
import Rating from '../Rating';
import AddToCart from './AddToCartBtn';

type Props = {
  data: {
    id: string;
    name: string;
    rating?: number | null;
    discount?: number | null;
    price: number;
    description: string;
    images: string[];
  };
};

export default function ProductDetailDescription({ data }: Props) {
  const [total, setTotal] = useState(1);

  const increase = () => {
    setTotal((val) => (val += 1));
  };

  const decrease = () => {
    setTotal((val) => {
      if (val === 1) return val;
      return (val -= 1);
    });
  };

  return (
    <div className="flex-1 flex-grow min-h-full max-w-lg lg:max-w-3xl gap-4 flex justify-self-center flex-col justify-between">
      <h1
        title={data.name}
        className="font-header leading-12 tracking-wide font-bold line-clamp-2 text-[40px]"
      >
        {data.name}
      </h1>
      {data.rating && <Rating value={data.rating} />}
      <div className="flex items-center gap-4">
        {data.discount && (
          <h1 className="font-bold text-3xl">
            ${data.price - (data.price * data.discount) / 100}
          </h1>
        )}
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
            <Minus />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <SlidingNumber value={total} />
          </div>
          <button
            onClick={increase}
            className="flex pr-1 items-center justify-center size-13"
          >
            <Plus />
          </button>
        </div>
        <AddToCart productId={data.id} quantity={total} />
      </div>
    </div>
  );
}
