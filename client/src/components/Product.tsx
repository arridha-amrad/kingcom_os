'use client';

import { useNavigate } from '@tanstack/react-router';
import Rating from './Rating';
import type { Product as TProduct } from '@/types/api/product';
import { Flame } from 'lucide-react';
import { formatToIdr } from '@/utils';

type Props = {
  product: TProduct;
};

function Product({
  product: { discount, images, name, price, average_rating, slug },
}: Props) {
  const router = useNavigate();
  const imageUrl = images[0].url;

  return (
    <div
      onClick={() => {
        router({ to: `/products/${slug}` });
      }}
      className="relative cursor-pointer w-full px-8 py-4 hover:ring-2 rounded-xl transition-all duration-200 ease-linear ring-foreground/20 overflow-hidden space-y-2"
    >
      <div className="overflow-hidden w-full">
        <img
          width={500}
          height={500}
          src={imageUrl}
          alt="new arrivals"
          className="w-full object-cover aspect-square"
        />
      </div>
      <h1 title={name} className="font-bold xl:text-[20px] line-clamp-2">
        {name}
      </h1>
      {average_rating ? (
        <Rating value={average_rating} />
      ) : (
        <div className="text-sm flex bg-yellow-500/20 items-end justify-end gap-1 w-fit py-1 px-2 rounded-full text-foreground font-medium">
          <Flame className="size-5 stroke-yellow-600 fill-yellow-400" />
          <span className="text-yellow-400 block">New product</span>
        </div>
      )}
      {discount > 0 && (
        <div className="flex items-center gap-2 ">
          <h2 className="opacity-40 line-through">{formatToIdr(price)}</h2>
          <div className="bg-red-500/10 w-fit text-red-500 rounded-full font-medium text-xs flex items-center justify-center py-1 px-2">
            -{discount}%
          </div>
        </div>
      )}
      <h2 className="font-bold xl:text-2xl text-xl">
        {formatToIdr(price - (price * discount) / 100)}
      </h2>
    </div>
  );
}

export default Product;
